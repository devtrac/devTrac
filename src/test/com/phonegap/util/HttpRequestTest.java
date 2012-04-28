package com.phonegap.util;

import javax.microedition.io.HttpConnection;

import junit.framework.TestCase;

public class HttpRequestTest extends TestCase {

    public void test_should_split_request_correct(){
        String reqURL = "sessionName=sessionID|POST|http://devtrac.org|postdata|json";
        String[] splitReqURL = new String[] { "sessionName=sessionID", "POST",
            "http://devtrac.org", "postdata", "json"};

        HttpRequest httpRrequest = new HttpRequest();
        String[] splitResult = httpRrequest.splitRequestUrl(reqURL);
        assertEquals(splitReqURL.length, splitResult.length);

        for (int i = 0; i < splitReqURL.length; i++) {
            assertEquals(splitReqURL[i], splitResult[i]);
        }
    }

    public void test_should_parse_correct() {
        HttpRequest httpRequest = new HttpRequest();
        httpRequest.parseFrom("sessionName=sessionID|POST|http://devtrac.org|postdata|json");

        assertEquals("sessionName=sessionID", httpRequest.getCookie());
        assertEquals(HttpConnection.POST, httpRequest.getMethod());
        assertEquals("http://devtrac.org", httpRequest.getUrl());
        assertEquals("postdata", httpRequest.getData());
    }

    public void test_should_parse_correct_when_req_without_post_data() {
        HttpRequest httpRequest = new HttpRequest();

        httpRequest.parseFrom("sessionName=sessionID|GET|http://devtrac.org|null|default");
        assertEquals("sessionName=sessionID", httpRequest.getCookie());
        assertEquals(HttpConnection.GET, httpRequest.getMethod());
        assertEquals("application/x-www-form-urlencoded", httpRequest.getContentType());
        assertEquals("http://devtrac.org", httpRequest.getUrl());
        assertNull(httpRequest.getData());
    }

    public void test_should_parse_correct_when_req_contains_content_type() {
        HttpRequest httpRequest = new HttpRequest();

        httpRequest.parseFrom("sessionName=sessionID|GET|http://devtrac.org|postdata|json");

        assertEquals("application/json", httpRequest.getContentType());
    }

}
