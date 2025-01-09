import { Client } from 'cassandra-driver';

const cassandraIP=process.env.CASSANDRA_IP||"localhost:9042";
const client = new Client({
  contactPoints: [cassandraIP], 
  localDataCenter: 'datacenter1', 
  keyspace: process.env.CASSANDRA_KEYSPACE||'sunbird', 
});

// Connect to the database
client.connect()
  .then(() => console.log('Connected to Cassandra'))
  .catch((err) => console.error('Error connecting to Cassandra:', err));

export { client };
