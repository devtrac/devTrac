package com.phonegap.api.impl;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;

import javax.microedition.io.Connector;
import javax.microedition.io.file.FileConnection;

import net.rim.device.api.io.Base64OutputStream;

import com.phonegap.PhoneGap;
import com.phonegap.api.Command;


public class FileCommand implements Command {
	private static final String CODE = "PhoneGap=file";
	private static final int READ_COMMAND = 0;
	
	/**
	 * Determines whether the specified instruction is accepted by the command. 
	 * @param instruction The string instrucstion passed from JavaScript via cookie.
	 * @return true if the Command accepts the instruction, false otherwise.
	 */
	public boolean accept(String instruction) {
		return instruction != null && instruction.startsWith(CODE);
	}
	
	/**
	 * Invokes internal phone application.
	 */
	public String execute(String instruction) {
		switch (getCommand(instruction)) {
			case READ_COMMAND: 
				try {
					String filePath = instruction.substring(CODE.length() + 6);
					Connector.open(filePath);
					FileConnection fileConnection= (FileConnection)Connector.open(filePath,Connector.READ);
					long fileSize = fileConnection.fileSize();
					long lastModified = fileConnection.lastModified();					
					String fileName = fileConnection.getName();
					InputStream fileStream =  fileConnection.openInputStream();
					ByteArrayOutputStream outStream = new ByteArrayOutputStream();
					Base64OutputStream base64OutStream = new Base64OutputStream(outStream);
					int byteRead=0;
					while((byteRead=fileStream.read()) != -1){
						base64OutStream.write(byteRead);
					}
					return ";if (navigator.file.read_success != null) { navigator.file.read_success({"
					+"name:'"+escapeString(fileName)
					+"',size:"+fileSize
					+",lastModified:"+lastModified
					+",mimeType:'"+escapeString(getMimeType(fileName))
					+"',data:'"+escapeString(outStream.toString())+"'}); };";
				} catch (Exception e) {
					return ";if (navigator.file.read_error != null) { navigator.file.read_error('Exception: " + e.getMessage().replace('\'', '`') + "'); };";
				}
		}
		return null;
	}
	
	private int getCommand(String instruction) {
		String command = instruction.substring(CODE.length()+1);
		if (command.startsWith("read")) return READ_COMMAND;
		return -1;
	}
	
	private String escapeString(String value) {
		// Replace the following:
		//   => \ with \\
		//   => " with \"
		//   => ' with \'
		value = PhoneGap.replace(value, "\\", "\\\\");
		value = PhoneGap.replace(value, "\"", "\\\"");
		value = PhoneGap.replace(value, "'", "\\'");
		
		return value;
	}
	
	private String getMimeType(String fileName){
		int dotPos = fileName.lastIndexOf('.');
		if(dotPos == -1) return "image/unknown";
		return "image/"+ fileName.toLowerCase().substring(dotPos+1);
	}
}
