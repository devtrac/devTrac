package com.phonegap.util;

import net.rim.device.api.system.CoverageInfo;
import net.rim.device.api.system.RadioInfo;

public class NetworkSuffixGenerator {

	public static final String TCP_IP = "tcp/ip";
	public static final String MDS = "mds";
	public static final String BIS = "bis";

	public String generateNetworkSuffix() {
		String suffix = "";
		if (hasTCPCoverage().booleanValue()) {
			suffix += ";deviceside=true";
			suffix += createWifiSuffix();
		} else
			suffix = createSuffixForNonTCP();
		
		return suffix;
	}

	private String createSuffixForNonTCP() {
		String suffix = "";
		if (hasBESCoverage().booleanValue()) {
			suffix += ";deviceside=false";
		} else {
			suffix += ";deviceside=true";
		}
		return suffix;
	}

	protected String createWifiSuffix() {
		String suffix = "";
		if ((RadioInfo.getActiveWAFs() & RadioInfo.WAF_WLAN) != 0) {
			if (hasTCPCoverage().booleanValue()) {
				suffix += ";interface=wifi";
			}
		}
		return suffix;
	}

	protected Boolean hasBESCoverage() {
		return new Boolean(
				CoverageInfo.isCoverageSufficient(CoverageInfo.COVERAGE_MDS));
	}

	protected Boolean hasTCPCoverage() {
		return new Boolean(CoverageInfo.isCoverageSufficient(
		CoverageInfo.COVERAGE_DIRECT, RadioInfo.WAF_WLAN, true));
	}
}
