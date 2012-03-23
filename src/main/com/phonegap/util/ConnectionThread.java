package com.phonegap.util;

import java.io.DataOutputStream;
import java.io.IOException;
import java.io.InputStream;

import javax.microedition.io.Connector;
import javax.microedition.io.HttpConnection;
import javax.microedition.io.StreamConnection;

import net.rim.device.api.system.DeviceInfo;
import net.rim.device.api.ui.UiApplication;

import com.phonegap.PhoneGap;
import com.phonegap.api.impl.LogCommand;

public class ConnectionThread extends Thread {
    private static final int TIMEOUT = 500; // ms

    private String _theUrl;
    private String _POSTdata;
    private String _cookie = null;

    private volatile boolean _fetchStarted = false;
    public volatile boolean _stop = false;

    private PhoneGap berryGap;

    public ConnectionThread(PhoneGap gap) {
        berryGap = gap;
    }

    // Retrieve the URL.
    private synchronized String getUrl() {
        return _theUrl;
    }

    private synchronized String getPOSTdata() {
        return _POSTdata;
    }

    // Fetch a page.
    // Synchronized so that we don't miss requests.
    public void fetch(String url, String POSTdata) {
        synchronized (this) {
            _fetchStarted = true;
            _theUrl = url;
            _POSTdata = POSTdata;
        }
    }

    public void updateCookie(String header) {
        if (isDrupal6()) return;
        if (null == header) return;
        this._cookie = header.substring(0, header.indexOf(';'));
    }

    private boolean isDrupal6() {
        return (_POSTdata != null) && (_POSTdata.indexOf("views.get") != -1);
    }

    public String getCookie() {
        return _cookie;
    }

    /**
     * Adds the specified text to the PhoneGap response queue. For use by
     * asynchronous XHR requests.
     */
    private void updateContent(final String text) {
        UiApplication.getUiApplication().invokeLater(new Runnable() {
            public void run() {
                berryGap.pendingResponses.addElement(text);
            }
        });
    }

    public void run() {
        for (;;) {
            _stop = false;
            // Thread control
            while (!_fetchStarted && !_stop) {
                // Sleep for a bit so we don't spin.
                try {
                    sleep(TIMEOUT);
                } catch (InterruptedException e) {
                    System.err.println(e.toString());
                }
            }

            // Exit condition
            if (_stop) {
                continue;
            }

            // This entire block is synchronized. This ensures we won't miss
            // fetch requests
            // made while we process a page.
            synchronized (this) {
                String content = "";
                HttpConnection httpConn = null;
                StreamConnection s = null;
                String postData = getPOSTdata();
                // Open the connection and extract the data.
                try {
                    if (postData != null) {
                        s = (StreamConnection) Connector.open(getUrl(),
                                Connector.READ_WRITE);
                    } else {
                        s = (StreamConnection) Connector.open(getUrl());
                    }
                    httpConn = (HttpConnection) s;
                    httpConn.setRequestMethod((postData != null) ? HttpConnection.POST
                            : HttpConnection.GET);
                    // === SET HTTP REQUEST HEADERS HERE ===
                    // Set the user agent string. Could try to parse out
                    // device models/numbers, but do I really want to? Yes,
                    // I do, according to this KB article:
                    // http://www.blackberry.com/knowledgecenterpublic/livelink.exe/fetch/2000/348583/800451/800563/How_To_-_Use_reliable_push_without_making_a_BlackBerry_Browser_request.html?nodeid=1222784&vernum=0
                    httpConn.setRequestProperty("user-agent",
                            "BlackBerry" + DeviceInfo.getDeviceName() + "/"
                                    + DeviceInfo.getSoftwareVersion());
                    // Also need to set profile header according to above
                    // article.
                    httpConn.setRequestProperty("profile",
                            "http://www.blackberry.net/go/mobile/profiles/uaprof/"
                                    + DeviceInfo.getDeviceName() + "/"
                                    + DeviceInfo.getSoftwareVersion()
                                    + ".rdf");
                    httpConn.setRequestProperty("Content-Type",
                            "application/x-www-form-urlencoded");

                    if (_cookie != null) {
                        httpConn.setRequestProperty("Cookie", getCookie());
                    }

                    // Here's an example of setting the Accept header to a
                    // particular subset of MIME types. By the HTTP spec, if
                    // none is specified the assumed value is 'all' types
                    // are accepted.
                    // httpConn.setRequestProperty("Accept","text/plain,text/html,application/rss+xml,text/javascript,text/xml");
                    // Setting the accepted character set. Same as above,
                    // default is all, so don't have to set it.
                    // httpConn.setRequestProperty("Accept-Charset","UTF-8,*");
                    // === WRITE OUT POST DATA HERE ===
                    if (postData != null) {
                        httpConn.setRequestProperty("Content-length",
                                String.valueOf(postData.length()));
                        DataOutputStream dos = httpConn
                                .openDataOutputStream();
                        byte[] postBytes = postData.getBytes();
                        for (int i = 0; i < postBytes.length; i++) {
                            dos.writeByte(postBytes[i]);
                        }
                        dos.flush();
                        dos.close();
                        dos = null;
                    }
                    int status = httpConn.getResponseCode();
                    // Tip: If you're not getting the expected response from
                    // an XHR call, pop a breakpoint here and see if the
                    // HTTP response code is 200. If you're getting a 406
                    // (Not Acceptable), the Accept header might be not set
                    // to some satisfactory value by the server.
                    if (status == HttpConnection.HTTP_OK) {
                        updateCookie(httpConn.getHeaderField("Set-Cookie"));

                        InputStream input = s.openInputStream();
                        byte[] data = new byte[256];
                        int len = 0;
                        int size = 0;
                        StringBuffer raw = new StringBuffer();

                        while (-1 != (len = input.read(data))) {
                            raw.append(new String(data, 0, len));
                            size += len;
                        }
                        content = raw.toString();
                        raw = null;
                        input.close();
                        input = null;
                    }
                    if (_stop)
                        continue;
                    updateContent(";if (navigator.network.XHR_success) { navigator.network.XHR_success("
                            + (!content.equals("") ? content
                                    : "{error:true,message:'Bad server response.',httpcode:"
                                            + status + "}") + "); };");
                    s.close();
                } catch (IOException e) {
                    if (_stop)
                        continue;
                    String resp = e.getMessage().toLowerCase();
                    if (content.equals("")) {
                        if (resp.indexOf("tunnel") > -1
                                || resp.indexOf("Tunnel") > -1
                                || resp.indexOf("apn") > -1
                                || resp.indexOf("APN") > -1) {
                            resp = "{error:true,message:'There was a communication error. Are your APN settings configured (BlackBerry menu -> Options -> Advanced Options -> TCP/IP). Contact your service provider for details on how to set up your APN settings.'}";
                        } else {
                            resp = "{error:true,message:'IOException during HTTP request: "
                                    + e.getMessage().replace('\'', ' ')
                                    + "',httpcode:null}";
                        }
                    } else {
                        resp = content;
                    }

                    LogCommand.LOG("Error while service call " + resp);

                    updateContent(";if (navigator.network.XHR_error) { navigator.network.XHR_error("
                            + resp + "); };");
                    resp = null;
                } finally {
                    content = null;
                    s = null;
                    httpConn = null;
                    postData = null;
                }
                // We're finished with the operation so reset the start
                // state.
                _fetchStarted = false;
            }
        }
    }
}
