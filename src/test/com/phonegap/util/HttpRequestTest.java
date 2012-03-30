package com.phonegap.util;

import javax.microedition.io.HttpConnection;

import org.mockito.Mockito;

import com.phonegap.util.HttpRequest;
import com.phonegap.util.NetworkSuffixGenerator;

import junit.framework.TestCase;

public class HttpRequestTest extends TestCase {

    public void test_should_split_request_correct(){
        String reqURL = "sessionName=sessionID|POST|http://devtrac.org|postdata";
        String[] splitReqURL = new String[] { "sessionName=sessionID", "POST",
            "http://devtrac.org", "postdata" };

        HttpRequest httpRrequest = new HttpRequest();
        String[] splitResult = httpRrequest.splitRequestUrl(reqURL);
        assertEquals(splitReqURL.length, splitResult.length);

        for (int i = 0; i < splitReqURL.length; i++) {
            assertEquals(splitReqURL[i], splitResult[i]);
        }
    }

    public void test_should_parse_correct() {
        HttpRequest httpRequest = new HttpRequest();
        httpRequest.parseFrom("sessionName=sessionID|POST|http://devtrac.org|postdata");

        assertEquals("sessionName=sessionID", httpRequest.getCookie());
        assertEquals(HttpConnection.POST, httpRequest.getMethod());
        assertEquals("http://devtrac.org", httpRequest.getUrl());
        assertEquals("postdata", httpRequest.getData());
    }

    public void test_should_parse_correct_when_req_without_post_data() {
        HttpRequest httpRequest = new HttpRequest();

        httpRequest.parseFrom("sessionName=sessionID|GET|http://devtrac.org|null");
        assertEquals("sessionName=sessionID", httpRequest.getCookie());
        assertEquals(HttpConnection.GET, httpRequest.getMethod());
        assertEquals("http://devtrac.org", httpRequest.getUrl());
        assertNull(httpRequest.getData());
    }

}
