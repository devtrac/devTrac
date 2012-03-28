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

    private static HttpRequest parse(String req) {
        String method = req.substring(0, req.indexOf("|"));

        String url = null;
        String data = null;

        int firstIndex = req.indexOf('|');
        if(onlyOnePipe(req)){
           url = req.substring(firstIndex + 1);
        }else{
            int lastIndex = req.lastIndexOf('|');
            url = req.substring(firstIndex + 1, lastIndex);
            data = req.substring(lastIndex + 1);
        }

        return new HttpRequest(method, url, data);
    }
    
    public static HttpRequest parseFrom(String reqURL) {
        int pipeIndex = reqURL.indexOf("|");
        HttpRequest httpRequest = defaultGetRequest(reqURL);
        if (pipeIndex > -1) {
            httpRequest = parse(reqURL);
        }
        return httpRequest;
    }

    private static boolean onlyOnePipe(String req) {
        return req.indexOf('|') == req.lastIndexOf('|');
    }

    public void addNetworkSuffix(){
        this.url += new NetworkSuffixGenerator().generateNetworkSuffix();
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

    private static HttpRequest defaultGetRequest(String reqURL) {
        return new HttpRequest(HttpConnection.GET, reqURL, null);
    }

    public String getUrlWithSuffix() {
        return this.url + new NetworkSuffixGenerator().generateNetworkSuffix();
    }
}
