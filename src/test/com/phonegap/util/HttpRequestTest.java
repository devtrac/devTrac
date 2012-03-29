package com.phonegap.util;

import javax.microedition.io.HttpConnection;

import org.mockito.Mockito;

import com.phonegap.util.HttpRequest;
import com.phonegap.util.NetworkSuffixGenerator;

import junit.framework.TestCase;

public class HttpRequestTest extends TestCase {

    public void test_should_parse_correct() {
        HttpRequest httpRequest = HttpRequest
                .parseFrom("POST|http://devtrac.org|postdata");
        assertEquals(HttpConnection.POST, httpRequest.getMethod());
        assertEquals("http://devtrac.org", httpRequest.getUrl());
        assertEquals("postdata", httpRequest.getData());
    }

    public void test_should_parse_correct_when_req_without_post_data() {
        HttpRequest httpRequest = HttpRequest.parseFrom("GET|http://devtrac.org");
        assertEquals(HttpConnection.GET, httpRequest.getMethod());
        assertEquals("http://devtrac.org", httpRequest.getUrl());
        assertNull(httpRequest.getData());
    }

    public void test_default_http_request_should_be_GET_method() {
        HttpRequest httpRequest = HttpRequest
                .parseFrom("http://devtrac.test.org");
        assertEquals(HttpConnection.GET, httpRequest.getMethod());
    }
}
