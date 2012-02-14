package com.phonegap.util;

import net.rim.device.api.system.CoverageInfo;
import net.rim.device.api.system.RadioInfo;

public class NetworkSuffixGenerator {
	
	public static final String TCP_IP = "tcp/ip";
	public static final String MDS = "mds";
	public static final String BIS = "bis";
	

	public String generateNetworkSuffix(String connectivityMethod) {
		String suffix = "";
		if (connectivityMethod.equals(MDS)){
			suffix += ";deviceside=false";
		}
		
		if (connectivityMethod.equals(TCP_IP)){
			suffix += ";deviceside=true";
			suffix += createWifiSuffix();
		}
		
		return suffix;
	}
	
	String createWifiSuffix(){
		String suffix = "";	
		if ((RadioInfo.getActiveWAFs() & RadioInfo.WAF_WLAN) != 0) {
				if (CoverageInfo.isCoverageSufficient(
						CoverageInfo.COVERAGE_DIRECT, RadioInfo.WAF_WLAN, true)) {
					suffix += ";interface=wifi";
				}
			}
		
		return suffix;
	}
	
	
//	public static String generateNetworkSuffix(String connectivityMethod) {
//		String suffix = "";
//		// Something that is used by the BlackBerry Enterprise Server for
//		// the BES Push apps. We want to initiate a direct TCP connection,
//		// so this parameter needs to be specified.
//		if (!DeviceInfo.isSimulator()) {
//			suffix += ";deviceside=true";
//		}
//		// Check for WIFI connectivity, optionally append the interface=wifi
//		// parameter to the end of URL.
//		// If you have data disabled and WIFI enabled, but you cannot access
//		// the network, then check that
//		// the device is not configured to connect to a VPN network.
//		// WIFI Connection > WIFI Options > Select the active network > Edit
//		// > Set VPN to None
	
//	String suffix = "";	
//	if ((RadioInfo.getActiveWAFs() & RadioInfo.WAF_WLAN) != 0) {
//			if (CoverageInfo.isCoverageSufficient(
//					CoverageInfo.COVERAGE_DIRECT, RadioInfo.WAF_WLAN, true)) {
//				suffix += ";interface=wifi";
//			}
//		}
//		return suffix;
//	}


}
