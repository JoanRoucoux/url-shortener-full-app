import ZooKeeper from 'zookeeper';

const { ZOOKEEPER_HOST, ZOOKEEPER_DOCKER_PORT } = process.env;

const host = `${ZOOKEEPER_HOST}:${ZOOKEEPER_DOCKER_PORT}`;

let client: ZooKeeper | null;

const TOKENS_NODE_PATH = '/tokens';

// Get ZooKeeper client
const getZookeeperClient = (): ZooKeeper => {
  if (!client) {
    const config = {
      connect: host,
      timeout: 5000,
      debug_level: ZooKeeper.constants.ZOO_LOG_LEVEL_WARN,
      host_order_deterministic: false,
    };

    client = new ZooKeeper(config);
  }

  return client;
};

// Connect to ZooKeeper
export const connectToZookeeper = async (): Promise<void> => {
  const client = getZookeeperClient();

  await new Promise<void>((resolve, reject) => {
    client.connect(client.config, (error) => {
      if (error) {
        console.error('Error connecting to ZooKeeper:', error);
        reject();
      }
      console.log('Successfully connected to ZooKeeper');
      resolve();
    });
  });
};

// Delete a node
const deleteNode = async (path: string): Promise<void> => {
  try {
    await getZookeeperClient().delete_(path, -1);
    console.info(`Node ${path} deleted`);
  } catch (error) {
    console.error(`Failed to delete node: ${error}`);
  }
};

// Delete nodes from tokens list
export const deleteNodes = async (tokens: string[]): Promise<void> => {
  const client = getZookeeperClient();
  const doesTokensNodeExist = await client.pathExists(TOKENS_NODE_PATH, false);

  if (doesTokensNodeExist) {
    tokens.forEach(async (token) => {
      const uniqueTokenPath = `${TOKENS_NODE_PATH}/${token}`;
      await deleteNode(uniqueTokenPath);
    });
  }
};
