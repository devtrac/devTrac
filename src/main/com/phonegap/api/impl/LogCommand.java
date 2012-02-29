package com.phonegap.api.impl;

import com.phonegap.api.Command;
import net.rim.device.api.system.EventLogger;

public class LogCommand implements Command {
	public static final String APP_NAME = "Devtrac";
	public static final long LOG_GUID = 0xfc5e6d9681f31621L;
	private static final String CODE = "PhoneGap=log";
	private static final int LOG_COMMAND = 0;
	private static final int DEBUG_COMMAND = 1;
	private static final int SET_DEBUG_COMMAND = 2;
	private static final int GET_DEBUG_COMMAND = 3;
	private static final int SHOW_COMMAND = 4;

	/**
	 * Determines whether the specified instruction is accepted by the command.
	 * 
	 * @param instruction
	 *            The string instrucstion passed from JavaScript via cookie.
	 * @return true if the Command accepts the instruction, false otherwise.
	 */
	public boolean accept(String instruction) {
		return instruction != null && instruction.startsWith(CODE);
	}

	/**
	 * Invokes internal phone application.
	 */
	public String execute(String instruction) {
		boolean logged = false;
		switch (getCommand(instruction)) {
		case LOG_COMMAND:
			String message = instruction.substring(CODE.length() + 5);
			logged = LOG( message);
			return ";if (navigator.log.logged != null) { navigator.log.logged("
					+ (logged ? "true" : "false") + "); };";
		case DEBUG_COMMAND:
			String debugMessage = instruction.substring(CODE.length() + 7);
			logged = DEBUG( debugMessage);
			return ";if (navigator.log.logged != null) { navigator.log.logged("
					+ (logged ? "true" : "false") + "); };";
		case SET_DEBUG_COMMAND:
			String setDebug = instruction.substring(CODE.length() + 11);
			EventLogger
					.setMinimumLevel(setDebug.equalsIgnoreCase("true") ? EventLogger.DEBUG_INFO
							: EventLogger.WARNING);
			return ";if (navigator.log.logged != null) { navigator.log.logged(true); };";
		case GET_DEBUG_COMMAND:
			int debugStatus = EventLogger.getMinimumLevel();
			return ";if (navigator.log.logged != null) { navigator.log.logged("+ ((debugStatus == EventLogger.DEBUG_INFO) ? "true":"false") +"); };";
		case SHOW_COMMAND:
			logged = EventLogger.startEventLogViewer();
			return ";if (navigator.log.logged != null) { navigator.log.logged("
					+ (logged ? "true" : "false") + "); };";
		}
		return null;
	}

	private int getCommand(String instruction) {
		String command = instruction.substring(CODE.length() + 1);
		if (command.startsWith("log"))
			return LOG_COMMAND;
		if (command.startsWith("debug"))
			return DEBUG_COMMAND;
		if (command.startsWith("set.debug"))
			return SET_DEBUG_COMMAND;
		if (command.startsWith("get.debug"))
			return GET_DEBUG_COMMAND;
		if (command.startsWith("show"))
			return SHOW_COMMAND;
		return -1;
	}
	
	public static boolean LOG(String logMessage){
		return EventLogger.logEvent(LOG_GUID, logMessage.getBytes());
	}
	
	public static boolean DEBUG(String debugMessage){
		return EventLogger.logEvent(LOG_GUID, debugMessage.getBytes(),
				EventLogger.DEBUG_INFO);
	}
}
