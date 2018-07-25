package com.muwire.core.connection

import java.io.InputStream
import java.io.OutputStream

import com.muwire.core.EventBus

import net.i2p.data.Destination

/**
 * This side is an ultrapeer and the remote is an ultrapeer too
 * @author zab
 */
class PeerConnection extends Connection {

	public PeerConnection(EventBus eventBus, InputStream inputStream, OutputStream outputStream, Destination remoteSide,
			boolean incoming) {
		super(eventBus, inputStream, outputStream, remoteSide, incoming)
	}

}