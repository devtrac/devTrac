package com.phonegap.util;

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
}
