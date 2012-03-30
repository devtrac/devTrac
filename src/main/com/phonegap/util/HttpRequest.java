package com.phonegap.util;

import javax.microedition.io.HttpConnection;

public class HttpRequest {

    private String method;
    private String url;
    private String data;
    private String cookie;

    public HttpRequest() {
    }

    public HttpRequest(String cookie, String method, String url, String data) {
        this.cookie = cookie;
        this.method = method;
        this.url = url;
        this.data = data;
    }

    public void parseFrom(String reqURL) {
        reqURL = takeOffCookie(reqURL);
        if (reqURL.indexOf("|") == -1) {
            this.method = HttpConnection.GET;
            this.url = reqURL;
        } else {
            reqURL = takeOffMethod(reqURL);
            this.data = takeOffUrl(reqURL);
        }
    }

    private String takeOffUrl(String reqURL) {
        int pipeIndex = reqURL.indexOf("|");
        if (pipeIndex == -1) {
            this.url = reqURL;
        } else {
            this.url = reqURL.substring(0, pipeIndex);
            return reqURL.substring(pipeIndex + 1);
        }
        return null;
    }

    private String takeOffMethod(String reqURL) {
        int pipeIndex = reqURL.indexOf("|");
        this.method = reqURL.substring(0, pipeIndex);
        return reqURL.substring(pipeIndex + 1);
    }

    private String takeOffCookie(String reqURL) {
        int pipeIndex = reqURL.indexOf("|");
        this.cookie = reqURL.substring(0, pipeIndex);
        return reqURL.substring(pipeIndex + 1);
    }

    public void addNetworkSuffix() {
        this.url += new NetworkSuffixGenerator().generateNetworkSuffix();
    }

    public String getCookie() {
        return this.cookie;
    }

    public String getMethod() {
        return this.method;
    }

    public String getUrl() {
        return url;
    }

    public String getData() {
        return this.data;
    }

    public String getUrlWithSuffix() {
        return this.url + new NetworkSuffixGenerator().generateNetworkSuffix();
    }

}
