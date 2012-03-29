/**
 * The MIT License
 * -------------------------------------------------------------
 * Copyright (c) 2008, Rob Ellis, Brock Whitten, Brian Leroux, Joe Bowser, Dave Johnson, Nitobi
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
package com.phonegap.api.impl;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;

import javax.microedition.io.Connector;
import javax.microedition.io.HttpConnection;
import javax.microedition.io.file.FileConnection;

import net.rim.device.api.io.Base64OutputStream;
import net.rim.device.api.system.RadioInfo;

import org.json.me.JSONException;
import org.json.me.JSONObject;

import com.phonegap.PhoneGap;
import com.phonegap.api.Command;
import com.phonegap.util.ConnectionThread;
import com.phonegap.util.HttpRequest;

public class NetworkCommand implements Command {

    private static final int REACHABLE_COMMAND = 0;
    private static final int XHR_UPLOAD_COMMAND = 1;
    private static final int XHR_COMMAND = 2;
    private static final String CODE = "PhoneGap=network";
    private static final int NOT_REACHABLE = 0;
    private static final int REACHABLE_VIA_CARRIER_DATA_NETWORK = 1;
    private static final int REACHABLE_VIA_WIFI_NETWORK = 2;
    private ConnectionThread connThread;

    public NetworkCommand(PhoneGap gap) {
        connThread = new ConnectionThread(gap);
        connThread.start();
    }

    /**
     * Determines whether the specified instruction is accepted by the command.
     *
     * @param instruction
     *            The string instruction passed from JavaScript via cookie.
     * @return true if the Command accepts the instruction, false otherwise.
     */
    public boolean accept(String instruction) {
        return instruction != null && instruction.startsWith(CODE);
    }

    public String execute(String instruction) {
        JSONObject fileData = null;
        String reqURL = null;
        switch (getCommand(instruction)) {
        case REACHABLE_COMMAND:
            // Determine the active Wireless Access Families
            // WiFi will have precedence over carrier data.
            int service = RadioInfo.getActiveWAFs();
            int reachability = NOT_REACHABLE;
            if ((service & RadioInfo.WAF_3GPP) != 0
                    || (service & RadioInfo.WAF_CDMA) != 0
                    || (service & RadioInfo.WAF_IDEN) != 0) {
                reachability = REACHABLE_VIA_CARRIER_DATA_NETWORK;
            }
            if ((service & RadioInfo.WAF_WLAN) != 0) {
                reachability = REACHABLE_VIA_WIFI_NETWORK;
            }
            return ";navigator.network.lastReachability = "
                    + reachability
                    + ";if (navigator.network.isReachable_success) navigator.network.isReachable_success("
                    + reachability + ");";
        case XHR_UPLOAD_COMMAND:
            int tildaIndex = instruction.lastIndexOf('~');
            reqURL = instruction.substring(CODE.length() + 11, tildaIndex);
            try {
                JSONObject fileDetails = new JSONObject(
                        instruction.substring(tildaIndex + 1));
                instruction = instruction.substring(0, tildaIndex);
                String filePath = fileDetails.getString("filePath");
                LogCommand.DEBUG("Reading " + filePath + " for uploading");
                String loggedinUser = fileDetails.getString("user");
                fileData = readFileData(filePath);
                String fileTargetPath = fileDetails.getString("targetPath")
                        + "/" + fileData.getString("filename");
                fileData.put("uid", loggedinUser);
                fileData.put("filepath", fileTargetPath);

                String POSTdata = null;
                if (fileData != null) {
                    POSTdata = "&file=" + urlEncode(fileData.toString());
                    try {
                        POSTdata = getPostData(fileData);
                        LogCommand.LOG("POSTdata:" + POSTdata);
                    } catch (Exception ex) {
                    }
                    connThread.fetch(new HttpRequest(HttpConnection.POST, reqURL, POSTdata));
                }

                reqURL = null;
                POSTdata = null;
                break;
            } catch (Exception e) {
                LogCommand
                        .DEBUG("Error while reading image file for uploading. "
                                + e.getMessage());
                return ";if (navigator.network.XHR_error) { navigator.network.XHR_error('Error occured while reading file.'); };";
            }
        case XHR_COMMAND:
            reqURL = reqURL == null ? instruction.substring(CODE.length() + 5)
                    : reqURL;

            HttpRequest httpRequest = HttpRequest.parseFrom(reqURL);

            LogCommand.LOG("Calling service " + httpRequest.getUrl());

            connThread.fetch(httpRequest);
            reqURL = null;
            break;
        }

        return null;
    }

    private String getPostData(JSONObject fileData) throws JSONException{
        String POSTdata = "";
        POSTdata += "uid=" + fileData.get("uid").toString();
        POSTdata += "&filesize=" + fileData.get("filesize").toString();
        POSTdata += "&filename=" + fileData.get("filename").toString();
        POSTdata += "&file=" + fileData.get("file").toString();
        return POSTdata;
    }

    private int getCommand(String instruction) {
        String command = instruction.substring(CODE.length() + 1);
        if (command.startsWith("reach"))
            return REACHABLE_COMMAND;
        if (command.startsWith("xhrupload"))
            return XHR_UPLOAD_COMMAND;
        if (command.startsWith("xhr"))
            return XHR_COMMAND;
        return -1;
    }

    public void stopXHR() {
        connThread._stop = true;
    }

    private JSONObject readFileData(String filePath) throws Exception {
        FileConnection fileConnection = null;
        try {
            fileConnection = (FileConnection) Connector.open(filePath,
                    Connector.READ);
            long fileSize = fileConnection.fileSize();
            long lastModified = fileConnection.lastModified();
            String fileName = fileConnection.getName();
            InputStream fileStream = fileConnection.openInputStream();
            ByteArrayOutputStream outStream = new ByteArrayOutputStream();
            Base64OutputStream base64OutStream = new Base64OutputStream(
                    outStream);
            int byteRead = 0;
            while ((byteRead = fileStream.read()) != -1) {
                base64OutStream.write(byteRead);
            }
            base64OutStream.flush();
            base64OutStream.close();
            outStream.flush();
            String base64Data = outStream.toString();
            outStream.close();

            JSONObject fileData = new JSONObject();
            fileData.put("file", base64Data);
            fileData.put("filename", fileName);
            fileData.put("filesize", fileSize);
            fileData.put("timestamp", lastModified);
            fileData.put("filemime", getMimeType(fileName));
            LogCommand.DEBUG("Successfully read file " + filePath
                    + ". Base 64 Data length is " + base64Data.length());
            return fileData;
        } catch (Exception e) {
            LogCommand.LOG("Fail to read file " + filePath + ". "
                    + e.getMessage());
            throw e;
        } finally {
            if (fileConnection != null && fileConnection.isOpen()) {
                try {
                    fileConnection.close();
                } catch (IOException e) {
                }
            }
        }

    }

    private String urlEncode(String value) {
        value = PhoneGap.replace(value, "+", "%2B");
        value = PhoneGap.replace(value, "=", "%3D");
        value = PhoneGap.replace(value, "/", "%2F");
        return value;
    }

    private String getMimeType(String fileName) {
        int dotPos = fileName.lastIndexOf('.');
        if (dotPos == -1)
            return "image/unknown";
        return "image/" + fileName.toLowerCase().substring(dotPos + 1);
    }
}

