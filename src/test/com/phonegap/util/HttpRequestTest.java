package com.phonegap.util;

import javax.microedition.io.HttpConnection;

import org.mockito.Mockito;

import com.phonegap.util.HttpRequest;
import com.phonegap.util.NetworkSuffixGenerator;

import junit.framework.TestCase;

public class HttpRequestTest extends TestCase {

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

    public void test_default_http_request_should_be_GET_method() {
        HttpRequest httpRequest = new HttpRequest();
        httpRequest.parseFrom("sessionName=sessionID|http://devtrac.org");
        assertEquals("sessionName=sessionID", httpRequest.getCookie());
        assertEquals(HttpConnection.GET, httpRequest.getMethod());
        assertEquals("http://devtrac.org", httpRequest.getUrl());
    }
}
