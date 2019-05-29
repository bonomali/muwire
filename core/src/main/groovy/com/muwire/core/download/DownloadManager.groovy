package com.muwire.core.download

import com.muwire.core.connection.I2PConnector
import com.muwire.core.EventBus

import java.util.concurrent.Executor
import java.util.concurrent.Executors

public class DownloadManager {
    
    private final EventBus eventBus
    private final I2PConnector connector
    private final Executor executor
    
    public DownloadManager(EventBus eventBus, I2PConnector connector) {
        this.eventBus = eventBus
        this.connector = connector
        this.executor = Executors.newCachedThreadPool({ r ->
            Thread rv = new Thread(r)
            rv.setName("download-worker")
            rv.setDaemon(true)
            rv
        })
    }
    
    
    public void onUIDownloadEvent(UIDownloadEvent e) {
        def downloader = new Downloader(e.target, e.result.size,
            e.result.infohash, e.result.pieceSize, connector, e.result.sender.destination)
        executor.execute({downloader.download()} as Runnable)
        eventBus.publish(new DownloadStartedEvent(downloader : downloader))
    }
}