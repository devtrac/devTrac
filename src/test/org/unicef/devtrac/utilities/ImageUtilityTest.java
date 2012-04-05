package org.unicef.devtrac.utilities;

import junit.framework.*;

public class ImageUtilityTest extends TestCase {

    public void test_get_resized_path_should_return_non_rem_path_if_contains_rem(){
        String resizedPath = ImageUtility.getResizedPath("bluedress.png.rem", 640, 480);
        assertEquals("bluedress_640x480.png.rem", resizedPath);
    }

    public void test_get_resized_path_should_return_path_if_NOT_contains_rem(){
        String resizedPath = ImageUtility.getResizedPath("bluedress.png", 640, 480);
        assertEquals("bluedress_640x480.png", resizedPath);
    }
}