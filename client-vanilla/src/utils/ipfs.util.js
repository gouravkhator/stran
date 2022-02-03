import * as IPFS from 'ipfs-core';

// this should be called after login. And we can save this node object in the app local storage
export async function createIPFSNode() {
    return await IPFS.create();
}

export async function addDataToIPFS(ipfsNode, data) {
    if (IPFS.isIPFS(ipfsNode)) {
        const results = ipfsNode.add(data);

        for await (const { cid } of results) {
            // CID (Content IDentifier) uniquely addresses the data
            // and can be used to get it again.
            return cid.toString();
        }
    }

    throw new Error("IPFS Node not created.. Please create one, before adding the data to IPFS");
}
