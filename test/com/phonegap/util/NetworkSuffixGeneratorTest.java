package com.phonegap.util;

import junit.framework.TestCase;


import org.mockito.Mockito;
public class NetworkSuffixGeneratorTest extends TestCase {
	private NetworkSuffixGenerator generator = new NetworkSuffixGenerator();
	
	public void test_should_generate_network_suffix_for_MDS(){
		String suffix = generator.generateNetworkSuffix(NetworkSuffixGenerator.MDS);
		
		assertEquals(";deviceside=false", suffix);
	}
	
	public void test_should_generate_network_suffix_for_TCP(){
		NetworkSuffixGenerator spy = spyCreateWifiSuffix(";interface=wifi");
		
		String suffix = spy.generateNetworkSuffix(NetworkSuffixGenerator.TCP_IP);
		
		assertEquals(";deviceside=true;interface=wifi", suffix);
	}
	
	public void Xtest_should_generate_network_suffix_for_BIS(){
		 String suffix = generator.generateNetworkSuffix(NetworkSuffixGenerator.BIS);
		 
		 assertEquals(";deviceside=false;ConnectionType=public-mds", suffix);
	}
	
	private NetworkSuffixGenerator spyCreateWifiSuffix(String createdSuffix) {
		NetworkSuffixGenerator spy = (NetworkSuffixGenerator) Mockito.spy(generator);
		((NetworkSuffixGenerator) Mockito.doReturn(createdSuffix).when(spy)).createWifiSuffix();
		return spy;
	}
	
	
	
	
	

}
