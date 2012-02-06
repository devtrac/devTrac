package com.phonegap.api.impl;

import org.unicef.devtrac.utilities.ImageUtility;

import com.phonegap.PhoneGap;
import com.phonegap.api.Command;

public class ImageCommand implements Command {
	private static final String CODE = "PhoneGap=image";
	private static final int RESIZE_COMMAND = 0;

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

	/**
	 * Invokes internal phone application.
	 */
	public String execute(String instruction) {
		switch (getCommand(instruction)) {
		case RESIZE_COMMAND:
			try {
				String imagePath = instruction.substring(CODE.length() + 8);
				String targetSize = imagePath.substring(0,
						imagePath.indexOf('~'));
				imagePath = imagePath.substring(imagePath.indexOf('~') + 1);
				int targetWidth = Integer.parseInt(targetSize.substring(0,
						targetSize.indexOf('x')));
				int targetHeight = Integer.parseInt(targetSize
						.substring(targetSize.indexOf('x') + 1));

				String targetPath = ImageUtility.resizeImage(imagePath,
						targetWidth, targetHeight);
				String errorMessage = "Could not resize image";
				if (targetPath != null && !targetPath.startsWith(ImageUtility.ERROR_PREFIX)) {
					return ";if (navigator.image.resize_success != null) { navigator.image.resize_success('"
							+ escapeString(targetPath) + "')};";
				} 
				if(targetPath.startsWith(ImageUtility.ERROR_PREFIX))
					errorMessage = targetPath.substring(ImageUtility.ERROR_PREFIX.length());
				return ";if (navigator.image.resize_error != null) { navigator.image.resize_error('Exception: "
							+ escapeString(errorMessage) + "'); };";
			} catch (Exception e) {
				return ";if (navigator.image.resize_error != null) { navigator.image.resize_error('Exception: "
						+ e.getMessage().replace('\'', '`') + "'); };";
			}
		}
		return null;
	}

	private int getCommand(String instruction) {
		String command = instruction.substring(CODE.length() + 1);
		if (command.startsWith("resize"))
			return RESIZE_COMMAND;
		return -1;
	}

	private String escapeString(String value) {
		// Replace the following:
		// => \ with \\
		// => " with \"
		// => ' with \'
		value = PhoneGap.replace(value, "\\", "\\\\");
		value = PhoneGap.replace(value, "\"", "\\\"");
		value = PhoneGap.replace(value, "'", "\\'");

		return value;
	}

}
