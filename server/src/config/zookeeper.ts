import ZooKeeper from 'zookeeper';
import { generateBase64Token } from '../utils';

const { ZOOKEEPER_HOST, ZOOKEEPER_DOCKER_PORT } = process.env;

const host = `${ZOOKEEPER_HOST}:${ZOOKEEPER_DOCKER_PORT}`;

let client: ZooKeeper | null;

const TOKENS_NODE_PATH = '/tokens';

const MAX_RETRIES = 3;
const MAX_TOKEN_SIZE = 6;

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
    client.connect(client.config, async (error) => {
      if (error) {
        console.error('Error connecting to ZooKeeper:', error);
        reject();
      }
      console.log('Successfully connected to ZooKeeper');
      await createTokensNode();
      resolve();
    });
  });
};

// Create '/tokens' node if it doesn't exist
const createTokensNode = async (): Promise<void> => {
  const client = getZookeeperClient();
  const doesTokensNodeExist = await client.pathExists(TOKENS_NODE_PATH, false);

  // If it does, do nothing
  if (doesTokensNodeExist) {
    console.info(`Tokens node ${TOKENS_NODE_PATH} already exists`);
    return;
  }

  // If it doesn't exist, create the root path
  await new Promise<void>((resolve, reject) => {
    client.mkdirp(TOKENS_NODE_PATH, (error) => {
      if (error) {
        console.error(`Failed to create tokens node: ${error}`);
        reject();
      }
      console.info(`Tokens node ${TOKENS_NODE_PATH} created`);
      resolve();
    });
  });
};

// Create a node
const createNode = async (path: string, data: Buffer): Promise<void> => {
  try {
    await getZookeeperClient().create(
      path,
      data,
      ZooKeeper.constants.ZOO_EPHEMERAL
    );
    console.info(`Node ${path} created`);
  } catch (error) {
    console.error(`Failed to create node: ${error}`);
    throw error;
  }
};

// Generate a unique token with retries for collision detection
export const generateUniqueToken = async (retryCount = 0): Promise<string> => {
  const client = getZookeeperClient();
  const token = generateBase64Token(MAX_TOKEN_SIZE);
  const uniqueTokenPath = `${TOKENS_NODE_PATH}/${token}`;

  // Create a child node with the generated token
  try {
    // Check if the unique token node already exists
    const doesUniqueTokenNodeExist = await client.pathExists(
      uniqueTokenPath,
      false
    );

    // If it does, retry
    if (doesUniqueTokenNodeExist) {
      if (retryCount < MAX_RETRIES) {
        console.log(
          `Token collision detected for path: ${uniqueTokenPath}. Retrying... Attempt ${
            retryCount + 1
          } of ${MAX_RETRIES}`
        );
        return await generateUniqueToken(retryCount + 1);
      } else {
        throw new Error(
          `Failed to generate a unique token after ${MAX_RETRIES} attempts due to collisions.`
        );
      }
    }

    // If it doesn't exist, create the node
    await createNode(uniqueTokenPath, Buffer.from(token));

    return token; // Return the unique token on success
  } catch (error) {
    console.error(`Error generating the unique token node: ${error}`);
    throw error;
  }
};
