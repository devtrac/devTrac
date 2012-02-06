package org.unicef.devtrac;

import net.rim.device.api.ui.UiApplication;

/**
 * This class extends the UiApplication class, providing a
 * graphical user interface.
 */
public class DevTrac extends UiApplication
{
    /**
     * Entry point for application
     * @param args Command line arguments (not used)
     */ 
    public static void main(String[] args)
    {
        // Create a new instance of the application and make the currently
        // running thread the application's event dispatch thread.
        DevTrac theApp = new DevTrac();       
        theApp.enterEventDispatcher();
    }
    

    /**
     * Creates a new DevTrac object
     */
    public DevTrac()
    {        
        // Push a screen onto the UI stack for rendering.
        pushScreen(new HomeScreen());
    }    
}
