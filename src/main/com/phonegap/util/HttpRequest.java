package com.phonegap.util;

import javax.microedition.io.HttpConnection;

public class HttpRequest {

    private String method;
    private String url;
    private String data;

    public HttpRequest(String method, String url, String data) {
        this.method = method;
        this.url = url;
        this.data = data;
    }

    public static HttpRequest parse(String req) {
        String method = req.substring(0, req.indexOf("|"));

        int firstPipe = req.indexOf('|');
        int lastPipe = req.lastIndexOf('|');

        String url = null;
        String data = null;

        if(firstPipe == lastPipe){
           url = req.substring(firstPipe + 1);
        }else{
            url = req.substring(firstPipe + 1, lastPipe);
            data = req.substring(lastPipe + 1);
        }

        return new HttpRequest(method, url, data);
    }

    public void addNetworkSuffix(){
        this.url += new NetworkSuffixGenerator().generateNetworkSuffix();
    }

    public String getMethod() {
        return this.method;
    }

    public String getUrl() {
        return this.url;
    }

    public String getData() {
        return this.data;
    }

    public static HttpRequest defaultGetRequest(String reqURL) {
        return new HttpRequest(HttpConnection.GET, reqURL, null);
    }
}
