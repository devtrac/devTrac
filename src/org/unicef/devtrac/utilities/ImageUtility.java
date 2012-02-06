package org.unicef.devtrac.utilities;

import java.io.InputStream;
import java.io.OutputStream;
import javax.microedition.io.Connector;
import javax.microedition.io.file.FileConnection;
import net.rim.device.api.math.Fixed32;
import net.rim.device.api.system.Bitmap;
import net.rim.device.api.system.EncodedImage;
import net.rim.device.api.system.JPEGEncodedImage;

public class ImageUtility {
	public static final String ERROR_PREFIX = "Error: ";

	public static String resizeImage(String path, int requiredWidth,
			int requiredHeight) {
		EncodedImage encodedImage = getBitmapImageForPath(path);
		encodedImage = getResizedEncodedImage(encodedImage, requiredWidth, requiredHeight);
		Bitmap resizedBitmap = encodedImage.getBitmap();
		byte[] resized = JPEGEncodedImage.encode(resizedBitmap, 75).getData();

		FileConnection fcImg = null;
		String imageExtension = "";
		String imagePathWintoutExtension = path;
		if (path.lastIndexOf('.') != -1) {
			imageExtension = path.substring(path.lastIndexOf('.'));
			imagePathWintoutExtension = path
					.substring(0, path.lastIndexOf('.'));
		}
		String resizedPath = imagePathWintoutExtension + "_" + requiredWidth
				+ "x" + requiredHeight + imageExtension;
		try {
			fcImg = (FileConnection) Connector.open(resizedPath,
					Connector.READ_WRITE);
			if (fcImg.exists()) {
				fcImg.delete();
			}
			fcImg.create();
			OutputStream out = fcImg.openOutputStream();
			out.write(resized);
			out.flush();
			out.close();
		} catch (Exception e) {
			return ERROR_PREFIX + e.getMessage();
		} finally {
			try {
				if (fcImg != null) {
					fcImg.close();
				}
			} catch (Exception e) {
			}
		}
		return resizedPath;
	}

	private static EncodedImage getResizedEncodedImage(
			EncodedImage encodedImage, int width, int height) {

		int currentWidthFixed32 = Fixed32.toFP(encodedImage.getWidth());
		int currentHeightFixed32 = Fixed32.toFP(encodedImage.getHeight());

		int requiredWidthFixed32 = Fixed32.toFP(width);
		int requiredHeightFixed32 = Fixed32.toFP(height);

		int scaleXFixed32 = Fixed32.div(currentWidthFixed32,
				requiredWidthFixed32);
		int scaleYFixed32 = Fixed32.div(currentHeightFixed32,
				requiredHeightFixed32);

		encodedImage = encodedImage.scaleImage32(scaleXFixed32, scaleYFixed32);
		return encodedImage;
	}

	public static EncodedImage getBitmapImageForPath(String imagePath) {
		FileConnection fconn = null;

		try {
			fconn = (FileConnection) Connector.open(imagePath, Connector.READ);
			if (fconn.exists()) {
				byte[] imageBytes = new byte[(int) fconn.fileSize()];
				InputStream inStream = fconn.openInputStream();
				inStream.read(imageBytes);
				inStream.close();
				EncodedImage eimg = EncodedImage.createEncodedImage(imageBytes,
						0, (int) fconn.fileSize());
				return eimg;
			}
		} catch (Exception e) {
		} finally {
			try {
				if (fconn != null) {
					fconn.close();
				}
			} catch (Exception e) {
				return null;
			}
		}
		return null;
	}
}