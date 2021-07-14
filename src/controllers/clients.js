import Clients from '../models/Clients';
import shortid from 'shortid';
import { decodeToken } from '../utils/decode-token';

class ClientController {
    static async getAllClients(req, res) {
        const clients = await Clients.find().sort({ createdAt: -1 });
        if (clients.length === 0) {
            return res.status(200).json({
                message: 'There are no clients in the system',
            });
        }
        res.json(clients);
    }

    static async getClient(req, res) {
        const { id } = req.params;
        const client = await Clients.findOne({ clientId: id });
        if (!client) {
            return res.status(400).json({
                message: `There are no clients who exist with id: ${id}`,
            });
        }
        res.json(client);
    }

    static async getClientByManager(req, res) {
        const decodedData = await decodeToken(req);
        const managerEmail = decodedData.email;
        const clients = await Clients.find({ managerEmail }).sort({
            createdAt: -1,
        });
        res.json(clients);
    }

    static async addClient(req, res) {
        const decodedData = await decodeToken(req);
        const managerEmail = decodedData.email;
        const {
            clientName,
            address,
            city,
            country,
            clientContactEmail,
            clientContactNumber,
        } = req.body;
        const existingClient = await Clients.findOne({ clientContactEmail });
        if (existingClient) {
            return res.status(400).json({
                message: `The email: ${clientContactEmail} has been registered, please use a different email or confirm it is a new client`,
            });
        }
        const clientId = shortid.generate();
        const newClient = new Clients({
            clientId,
            clientName,
            address,
            managerEmail,
            city,
            country,
            clientContactEmail,
            clientContactNumber,
        });

        const client = await newClient.save();
        return res
            .status(201)
            .json({ client, message: 'You have  added a client' });
    }

    static async updateClient(req, res) {
        const decodedData = await decodeToken(req);
        const managerEmail = decodedData.email;
        const { id } = req.params;
        const checkExistingClient = await Clients.findOne({ clientId: id });
        if (!checkExistingClient) {
            return res.status(400).json({
                message: `There are no clients with id: ${id}`,
            });
        }

        if (managerEmail !== checkExistingClient.managerEmail) {
            return res.status(400).json({
                message: 'This admin does not manage this client',
            });
        }

        await Object.assign(checkExistingClient, req.body);
        checkExistingClient.save();
        return res.status(201).json({
            checkExistingClient,
            message: 'You have  updated the client',
        });
    }

    static async deleteClient(req, res) {
        const { id } = req.params;
        const client = await Clients.findOne({ clientId: id });
        if (!client) {
            return res.status(400).json({
                message: `There are no loans disbursed with id: ${id}`,
            });
        }
        await client.remove();
        return res.status(204).json({});
    }
}

export default ClientController;
