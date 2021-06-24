// Add clusters based on the number of available cpus
import cluster from 'cluster';
import os from 'os';

if (cluster.isMaster) {
    const cpus = os.cpus().length;

    console.log(`Forking for ${cpus} CPUs`);
    for (let i = 0; i < cpus; i++) {
        cluster.fork();
    }
} else {
    require('./index');
}
