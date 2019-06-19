# TODO List

Not in any particular order yet

### Big Items

##### Alternate Locations

This helps peers discover new sources for a file while the download is in progress.  Also makes sharing of partial files possible.

##### Bloom Filters

This reduces query traffic by not sending last hop queries to peers that definitely do not have the file

##### Two-tier Topology

This helps with scalability

##### Trust List Sharing

For helping users make better decisions whom to trust

##### Content Control Panel

To allow every user to not route queries for content they do not like.  This is mostly GUI work, the backend part is simple

##### Packaging With JRE, Embedded Router

For ease of deployment for new users, and so that users do not need to run a separate I2P router

##### Web UI, REST Interface, etc.

Basically any non-gui non-cli user interface

##### Metadata editing and search

To enable parsing of metadata from known file types and the user editing it or adding manual metadata

### Small Items

* Detect if router is dead and show warning or exit
* Wrapper of some kind for in-place upgrades
* Download file sequentially
* Unsharing of files
* Multiple-selection download, Ctrl-A