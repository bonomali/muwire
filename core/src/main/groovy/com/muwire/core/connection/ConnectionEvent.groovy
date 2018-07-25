package com.muwire.core.connection

import com.muwire.core.Event

import net.i2p.data.Destination

class ConnectionEvent extends Event {

	Endpoint endpoint
	boolean incoming
	ConnectionAttemptStatus status

}