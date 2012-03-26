package com.phonegap.util;

import com.phonegap.PhoneGap;
import com.phonegap.util.ConnectionThread;

import junit.framework.Assert;
import junit.framework.TestCase;

public class ConnectionThreadTest extends TestCase {
	final String cookie = "SESS4df45f21b05409b30c5eca0efe59f22a=91tphJbS7weIiGaMhbk1CyBAiqumHzIw1oyyNmoHMno";
	final String header = cookie + "; expires=Sun, 15-Apr-2012 09:57:54 GMT; path=/; domain=.geo.devtrac.org; HttpOnly";
	
	ConnectionThread connectionThread;
	
	public void setUp() {
		connectionThread = new ConnectionThread(null);
	}

	public void test_cookie_should_be_updated() {
		connectionThread.updateCookie(header);

		assertEquals(cookie, connectionThread.getCookie());
	}

	public void test_cookie_should_NOT_be_updated_when_cookie_does_not_exist() {
		connectionThread.updateCookie(header);

		connectionThread.updateCookie(null);

		assertEquals(cookie, connectionThread.getCookie());
	}

	public void test_request_method_should_be_GET(){
	    assertEquals("GET",connectionThread.generateRequestMethod("method=GET&test"));
	}

	public void test_the_default_request_method_should_be_GET(){
	   assertEquals("GET",connectionThread.generateRequestMethod("asdfasdf"));
	}

    public void test_request_method_should_be_POST(){
        assertEquals("POST",connectionThread.generateRequestMethod("method=POST&test"));
    }

    public void test_request_method_should_be_PUT(){
        assertEquals("PUT",connectionThread.generateRequestMethod("method=PUT&test"));
    }
}
