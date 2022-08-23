# orbs-client
Client side gateway to access ORBS nodes by IP randomly or round robin

## Install
```
npm install @orbs-network/orbs-client
```

## Get Started
```js
const client = import "@orbs-network/orbs-client"

async function start(){
    await client.init();
    // get a live ORBS node IP
    const node = client.getRandomNode();
    // get nodes status
    const url = 'http://'+node.Ip+'/services/management-service/status';
    const response = await axios.get(url);
    console.log(`${node.Name} status`)
    console.log(response);
}
```

## API

### Node (type)
```JSON
{
    "EthAddress": "0874bc1383958e2475df73dc68c4f09658e23777",
    "OrbsAddress": "067a8afdc6d7bafa0ccaa5bb2da867f454a34dfa",
    "Ip": "46.101.165.46",
    "Port": 0,
    "Name": "Wings Stiftung"
}
```

### init
```JS
// optional array of seed HostNames of nodes
// if node provided- a hard coded array is used
const seed = [
    '54.95.108.148',
    '0xcore.orbs.network'
];
client.init(seed);
```

> TODO: init with infura to get the committee from ethereum network
### getRandomNode
```JS
// select weather to get any node or only a node from orbs 21 node committee
const committeeOnly = true;
// use random index to select the node.
const node = client.getRandomNode(committeeOnly)
```

### getNextNode
```JS
// select weather to get any node or only a node from orbs 21 node committee
const committeeOnly = false;
// uses round robin to fetch next node
const node = client.getNextNode(committeeOnly)
```

> Please notice the health of the node is checked every 10 minutes. Its the user's responsibility to call another node upon a failure.