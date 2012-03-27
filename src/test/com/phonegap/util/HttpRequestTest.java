package com.phonegap.util;

import javax.microedition.io.HttpConnection;

import com.phonegap.util.HttpRequest;

import junit.framework.Assert;
import junit.framework.TestCase;

public class HttpRequestTest extends TestCase {

    public void test_should_parse_correct(){
        HttpRequest httpRequest = HttpRequest.parse("POST|http://devtrac.org|postdata");
        assertEquals("POST",httpRequest.getMethod());
        assertEquals("http://devtrac.org",httpRequest.getUrl());
        assertEquals("postdata",httpRequest.getData());
    }

    public void test_should_parse_correct_when_req_without_post_data(){
        HttpRequest httpRequest = HttpRequest.parse("GET|http://devtrac.org");
        assertEquals("GET",httpRequest.getMethod());
        assertEquals("http://devtrac.org",httpRequest.getUrl());
        Assert.assertNull(httpRequest.getData());
    }

    public void test_default_http_request_should_be_GET_method() {
        HttpRequest httpRequest = HttpRequest
                .defaultGetRequest("http://devtrac.test.org");
        assertEquals(HttpConnection.GET, httpRequest.getMethod());
    }
}
