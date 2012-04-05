package com.phonegap.api.impl;

import junit.framework.*;

public class NetworkCommandTest extends TestCase {

    public void test_extract_file_name_should_correct(){
        NetworkCommand networkCommand = new NetworkCommand(null);
        String filePath = "Bluedress_640x480.png_640x480";
        Assert.assertEquals("Bluedress_640x480.png", networkCommand.extractFileName(filePath));
    }
}