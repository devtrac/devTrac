package com.phonegap.api.impl;

import junit.framework.*;
import org.json.me.JSONException;
import org.json.me.JSONObject;

import com.phonegap.api.impl.NetworkCommand;

import java.io.*;
import javax.microedition.io.file.FileConnection;
import javax.microedition.io.Connector;

public class NetworkCommandTest extends TestCase {
	
	public void test_extract_photo_name_should_correct(){
		NetworkCommand networkCommand = new NetworkCommand(null);
		
		String photoPath = "Bluedress_640x480.png_640x480";
		Assert.assertEquals("Bluedress_640x480.png", networkCommand.extractFileName(photoPath));
	}

}
