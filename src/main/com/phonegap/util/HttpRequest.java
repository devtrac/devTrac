package com.phonegap.util;

public class HttpRequest {

    private String method;
    private String url;
    private String data;
    private String cookie;
    private String contentType;
    private static final int REQUEST_FIELD_NUM = 5;

    public HttpRequest() {
    }

    public void parseFrom(String reqURL) {
        String [] requests = this.splitRequestUrl(reqURL);

        this.cookie = requests[0];
        this.method = requests[1];
        this.url = requests[2];
        this.data = (requests[3].equals("null")) ? null : requests[3];
        this.contentType = requests[4].equals("json")? "application/json" : "application/x-www-form-urlencoded";
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

    public void setData(String data){
        this.data = data;
    }

    protected String[] splitRequestUrl(String reqURL){
        String [] result = new String [REQUEST_FIELD_NUM] ;
        int i = 0 , pipeIndex;

        while ((pipeIndex = reqURL.indexOf("|")) != -1){
            result [i] = reqURL.substring(0, pipeIndex);
            reqURL = reqURL.substring(pipeIndex + 1);
            i ++;
        }
        result[i++] = reqURL;

        return result;
    }

    public String getUrlWithSuffix() {
        return this.url + new NetworkSuffixGenerator().generateNetworkSuffix();
    }

    public String getContentType() {
        return this.contentType;
    }

}
