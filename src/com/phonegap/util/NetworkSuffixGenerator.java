package com.phonegap.util;

import net.rim.device.api.system.CoverageInfo;
import net.rim.device.api.system.RadioInfo;

public class NetworkSuffixGenerator {

	public static final String TCP_IP = "tcp/ip";
	public static final String MDS = "mds";
	public static final String BIS = "bis";

	public String generateNetworkSuffix() {
		String suffix = "";
		
		if (hasBESCoverage().booleanValue()) {
			suffix += ";deviceside=false";
		} else if (hasBISCoverage().booleanValue()) {
			suffix += ";deviceside=false;ConnectionType=mds-public";
		} else {
			suffix += ";deviceside=true";
			suffix += createWifiSuffix();
		}
		return suffix;
	}

	public String createWifiSuffix() {
		String suffix = "";
		if ((RadioInfo.getActiveWAFs() & RadioInfo.WAF_WLAN) != 0) {
			if (hasTCPCoverage().booleanValue()) {
				suffix += ";interface=wifi";
			}
		}
		return suffix;
	}

	public Boolean hasBESCoverage() {
		return new Boolean(
				CoverageInfo.isCoverageSufficient(CoverageInfo.COVERAGE_MDS));
	}

	public Boolean hasBISCoverage() {
		return new Boolean(
				CoverageInfo.isCoverageSufficient(CoverageInfo.COVERAGE_BIS_B));
	}

	public Boolean hasTCPCoverage() {
		return new Boolean(CoverageInfo.isCoverageSufficient(
		CoverageInfo.COVERAGE_DIRECT, RadioInfo.WAF_WLAN, true));
	}

}
