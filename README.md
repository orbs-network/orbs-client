# orbs-client
Client side gateway to access ORBS nodes by IP with filtering and iteration support

## Install
```bash
npm install @orbs-network/orbs-client
```

## Get Started

### Basic Usage

```typescript
import { Client } from '@orbs-network/orbs-client';

async function example() {
  // Create client with a seed node IP
  const seedIP = '13.112.58.64';
  const client = new Client(seedIP);
  
  // Initialize - fetches topology and committee data
  await client.init();
  
  // Check if initialized
  if (client.initialized()) {
    console.log('Client initialized successfully');
  }
}
```

## Filtering Nodes

The `getNodes()` method accepts an optional `NodeFilter` object to filter nodes based on various criteria. All filter options are optional and can be combined.

### Filter Options

#### `committeeOnly?: boolean`
When set to `true`, returns only nodes that are members of the current committee.

```typescript
// Get only committee nodes
const committeeNodes = await client.getNodes({ committeeOnly: true });

// Get all nodes (committee and non-committee)
const allNodes = await client.getNodes({ committeeOnly: false });
// or simply
const allNodes = await client.getNodes();
```

#### `onlineOnly?: boolean`
When set to `true`, the client will check each node's status by fetching from its management service endpoint. Only nodes that respond successfully will be returned.

**Important Notes:**
- Status checks are performed in parallel with a 5-second timeout per node
- This operation may take several seconds depending on network conditions
- Each node's `online` property will be set to `true` for returned nodes
- The `updatedTime` field stores when the status was checked
- The `statusData` field contains the full status JSON response

```typescript
// Get only online nodes
const onlineNodes = await client.getNodes({ onlineOnly: true });

// Get online committee nodes
const onlineCommittee = await client.getNodes({ 
  committeeOnly: true,
  onlineOnly: true 
});
```

#### `teeHardware?: boolean`
Filters nodes based on whether they have TEE (Trusted Execution Environment) hardware.

```typescript
// Get nodes with TEE hardware
const teeNodes = await client.getNodes({ teeHardware: true });

// Get nodes without TEE hardware
const nonTeeNodes = await client.getNodes({ teeHardware: false });
```

### Combining Filters

You can combine multiple filters to get exactly the nodes you need:

```typescript
// Get online committee nodes without TEE hardware
const filtered = await client.getNodes({
  committeeOnly: true,
  onlineOnly: true,
  teeHardware: false
});
```

**Filter Order:**
1. First, `committeeOnly` filter is applied (if specified)
2. Then, `teeHardware` filter is applied (if specified)
3. Finally, `onlineOnly` filter is applied (if specified) - this checks status for each remaining node

### Filter Examples

```typescript
// Example 1: All committee nodes
const committee = await client.getNodes({ committeeOnly: true });

// Example 2: All online nodes (checks all nodes in topology)
const online = await client.getNodes({ onlineOnly: true });

// Example 3: Online committee nodes
const onlineCommittee = await client.getNodes({
  committeeOnly: true,
  onlineOnly: true
});

// Example 4: Committee nodes with TEE hardware
const teeCommittee = await client.getNodes({
  committeeOnly: true,
  teeHardware: true
});

// Example 5: Online committee nodes without TEE hardware
const onlineNonTeeCommittee = await client.getNodes({
  committeeOnly: true,
  onlineOnly: true,
  teeHardware: false
});
```

## Getting Nodes

### Get Committee Nodes

```typescript
import { Client } from '@orbs-network/orbs-client';

const client = new Client('13.112.58.64');
await client.init();

// Get only committee nodes
const committeeNodes = await client.getNodes({ committeeOnly: true });

// Iterate through committee nodes
let node = committeeNodes.next();
while (node !== null) {
  console.log(`Committee Node: ${node.name} (${node.ip})`);
  console.log(`Effective Stake: ${node.effectiveStake}`);
  node = committeeNodes.next();
}

// Or get by index
const firstCommitteeNode = committeeNodes.get(0);
const lastCommitteeNode = committeeNodes.get(-1); // -1 means last

// Get count
console.log(`Committee size: ${committeeNodes.size()}`);
```

### Get All Topology Nodes

```typescript
import { Client } from '@orbs-network/orbs-client';

const client = new Client('13.112.58.64');
await client.init();

// Get all nodes (topology)
const allNodes = await client.getNodes();

// Iterate through all nodes
let node = allNodes.next();
while (node !== null) {
  console.log(`Node: ${node.name}`);
  console.log(`In Committee: ${node.inCommittee}`);
  node = allNodes.next();
}

// Get total count
console.log(`Total nodes: ${allNodes.size()}`);
```

### Get Online Nodes Only

```typescript
import { Client } from '@orbs-network/orbs-client';

const client = new Client('13.112.58.64');
await client.init();

// Get online committee nodes (checks each node's status)
const onlineCommitteeNodes = await client.getNodes({ 
  committeeOnly: true,
  onlineOnly: true 
});

// All returned nodes are guaranteed to be online
let node = onlineCommitteeNodes.next();
while (node !== null) {
  console.log(`Online Node: ${node.name}`);
  console.log(`Status checked at: ${node.updatedTime}`);
  console.log(`Status data:`, node.statusData);
  node = onlineCommitteeNodes.next();
}
```

> **Note:** When `onlineOnly: true`, the client fetches status from each node's management service endpoint. This may take a few seconds as it checks nodes in parallel with a 5-second timeout per node.

### Filter by TEE Hardware

```typescript
import { Client } from '@orbs-network/orbs-client';

const client = new Client('13.112.58.64');
await client.init();

// Get nodes without TEE hardware
const nonTeeNodes = await client.getNodes({ 
  teeHardware: false 
});

// Get nodes with TEE hardware
const teeNodes = await client.getNodes({ 
  teeHardware: true 
});
```

### Combined Filters

```typescript
import { Client } from '@orbs-network/orbs-client';

const client = new Client('13.112.58.64');
await client.init();

// Get online committee nodes without TEE hardware
const filteredNodes = await client.getNodes({
  committeeOnly: true,
  onlineOnly: true,
  teeHardware: false
});
```

## Node Properties

Each node object contains the following properties:

```typescript
interface Node {
  name: string;                    // Node name
  ip: string;                      // Node IP address
  port: number;                     // Node port
  website: string;                 // Guardian website
  guardianAddress: string;          // Ethereum address (guardian)
  nodeAddress: string;              // Orbs address
  reputation: number;               // Node reputation
  online: boolean;                 // Online status (updated when onlineOnly filter is used)
  effectiveStake: number;           // Effective stake (sorted descending)
  enterTime: number;                // Timestamp when guardian entered
  weight: number;                   // Guardian weight
  inCommittee: boolean;             // Whether node is in committee
  updatedTime?: number;             // Timestamp when status was last checked
  statusData?: any;                 // Full status JSON from node
  teeHardware?: boolean;            // Whether node has TEE hardware
}
```

## RPC Calls

Each `Node` instance provides methods to make RPC calls directly to the node's service endpoints. These methods allow you to interact with the node's management and other services.

### GET Requests

The `get()` method makes an HTTP GET request to a node's service endpoint.

```typescript
async get(path: string, timeoutMs?: number): Promise<Response>
```

**Parameters:**
- `path: string` - The service endpoint path (e.g., `'signer/status'` or `'/management-service/status'`)
- `timeoutMs?: number` - Optional timeout in milliseconds (default: 5000)

**Returns:** A `Promise<Response>` that resolves to a `Response` object (standard fetch API response)

**Example:**

```typescript
import { Client } from '@orbs-network/orbs-client';

const client = new Client('13.112.58.64');
await client.init();

// Get a node
const nodes = await client.getNodes({ committeeOnly: true });
const node = nodes.get(0);

if (node) {
  // Make GET request to signer status endpoint
  const response = await node.get('signer/status');
  
  if (response.ok) {
    const data = await response.json();
    console.log('Signer status:', data);
  } else {
    console.error('Request failed:', response.status);
  }
  
  // With custom timeout
  const quickResponse = await node.get('signer/status', 2000);
}
```

**URL Construction:**
The method automatically constructs the full URL as:
- `http://{node.ip}:{node.port}/services/{path}`
- If `port` is `0`, the port is omitted (defaults to port 80)
- Leading slashes in the path are normalized

### POST Requests

The `post()` method makes an HTTP POST request to a node's service endpoint.

```typescript
async post(path: string, body?: any, timeoutMs?: number): Promise<Response>
```

**Parameters:**
- `path: string` - The service endpoint path
- `body?: any` - Optional request body. Can be:
  - `string` - Sent as `text/plain`
  - `object` - Automatically JSON stringified and sent as `application/json`
  - `undefined` - No body is sent
- `timeoutMs?: number` - Optional timeout in milliseconds (default: 5000)

**Returns:** A `Promise<Response>` that resolves to a `Response` object (standard fetch API response)

**Example:**

```typescript
import { Client } from '@orbs-network/orbs-client';

const client = new Client('13.112.58.64');
await client.init();

const nodes = await client.getNodes({ committeeOnly: true });
const node = nodes.get(0);

if (node) {
  // POST with JSON object
  const jsonBody = { action: 'start', params: { key: 'value' } };
  const response = await node.post('management-service/command', jsonBody);
  
  if (response.ok) {
    const result = await response.json();
    console.log('Command result:', result);
  }
  
  // POST with string body
  const stringResponse = await node.post('some-endpoint', 'plain text data');
  
  // POST without body
  const noBodyResponse = await node.post('trigger-action');
}
```

**Content-Type Handling:**
- If `body` is a `string`: Sets `Content-Type: text/plain`
- If `body` is an `object`: Sets `Content-Type: application/json` and JSON stringifies the body
- If `body` is `undefined`: No `Content-Type` header is set and no body is sent

### RPC Call Examples

```typescript
import { Client } from '@orbs-network/orbs-client';

async function rpcExamples() {
  const client = new Client('13.112.58.64');
  await client.init();
  
  // Get online committee nodes
  const nodes = await client.getNodes({ 
    committeeOnly: true,
    onlineOnly: true 
  });
  
  // Iterate through nodes and make RPC calls
  let node = nodes.next();
  while (node !== null) {
    try {
      // GET request example
      const statusResponse = await node.get('signer/status');
      if (statusResponse.ok) {
        const status = await statusResponse.json();
        console.log(`${node.name} status:`, status);
      }
      
      // POST request example
      const commandResponse = await node.post('management-service/command', {
        action: 'get-info'
      });
      
      if (commandResponse.ok) {
        const info = await commandResponse.json();
        console.log(`${node.name} info:`, info);
      }
    } catch (error) {
      console.error(`Error calling ${node.name}:`, error);
    }
    
    node = nodes.next();
  }
}
```

**Important Notes:**
- Both `get()` and `post()` methods use `AbortController` for timeout handling
- If a timeout occurs, the request is aborted and the promise may reject
- The default timeout is 5 seconds (5000ms)
- Always check `response.ok` before parsing JSON
- Handle errors appropriately as network requests can fail

## API Reference

### Client

#### `constructor(seedIP: string)`
Creates a new Client instance with a seed node IP address.

```typescript
const client = new Client('13.112.58.64');
```

#### `async init(): Promise<void>`
Initializes the client by fetching topology and committee data from the seed node.

```typescript
await client.init();
```

#### `initialized(): boolean`
Returns `true` if the client has been successfully initialized.

```typescript
if (client.initialized()) {
  // Safe to call getNodes()
}
```

#### `async getNodes(filter?: NodeFilter): Promise<Nodes>`
Returns a `Nodes` iterator with filtered nodes.

**Filter Options:**
- `committeeOnly?: boolean` - If `true`, only returns nodes in the committee
- `onlineOnly?: boolean` - If `true`, checks each node's status and only returns online nodes
- `teeHardware?: boolean` - Filter by TEE hardware presence (`true`/`false`)

```typescript
const nodes = await client.getNodes({ 
  committeeOnly: true,
  onlineOnly: true 
});
```

### Nodes Iterator

#### `next(): Node | null`
Returns the next node in the iterator, or `null` when iteration is complete.

```typescript
let node = nodes.next();
while (node !== null) {
  console.log(node.name);
  node = nodes.next();
}
```

#### `get(index: number): Node | null`
Gets a node by index. Use `-1` to get the last node.

```typescript
const first = nodes.get(0);
const last = nodes.get(-1);
```

#### `size(): number`
Returns the total number of nodes in the iterator.

```typescript
const count = nodes.size();
```

## Sorting

Nodes are automatically sorted by `effectiveStake` in descending order (highest stake first). This ensures that when you iterate through nodes, you get them in order of stake.

## Complete Example

```typescript
import { Client } from '@orbs-network/orbs-client';

async function main() {
  const seedIP = '13.112.58.64';
  const client = new Client(seedIP);
  
  try {
    await client.init();
    
    if (!client.initialized()) {
      console.error('Failed to initialize client');
      return;
    }
    
    // Get online committee nodes
    const onlineCommittee = await client.getNodes({
      committeeOnly: true,
      onlineOnly: true
    });
    
    console.log(`Found ${onlineCommittee.size()} online committee nodes`);
    
    // Iterate through nodes
    let node = onlineCommittee.next();
    while (node !== null) {
      console.log(`\n${node.name}`);
      console.log(`  IP: ${node.ip}:${node.port}`);
      console.log(`  Stake: ${node.effectiveStake}`);
      console.log(`  Guardian: ${node.guardianAddress}`);
      console.log(`  Online: ${node.online}`);
      
      node = onlineCommittee.next();
    }
    
    // Get first and last nodes
    const firstNode = onlineCommittee.get(0);
    const lastNode = onlineCommittee.get(-1);
    
    if (firstNode && lastNode) {
      console.log(`\nHighest stake: ${firstNode.effectiveStake}`);
      console.log(`Lowest stake: ${lastNode.effectiveStake}`);
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
```

## Browser Usage

For browser usage, include the bundled script:

```html
<script src="https://unpkg.com/@orbs-network/orbs-client/dist/index.min.js"></script>
<script>
  async function init() {
    const seedIP = '13.112.58.64';
    const client = new window.orbsClient.Client(seedIP);
    
    await client.init();
    
    const nodes = await client.getNodes({ committeeOnly: true });
    let node = nodes.next();
    while (node !== null) {
      console.log(node.name);
      node = nodes.next();
    }
  }
  
  init();
</script>
```

## Notes

- Nodes are sorted by `effectiveStake` in descending order
- When using `onlineOnly: true`, status is checked with a 5-second timeout per node
- Status checks are performed in parallel for better performance
- The `updatedTime` field stores when the node's status was last checked
- The `statusData` field contains the full status JSON response from the node
