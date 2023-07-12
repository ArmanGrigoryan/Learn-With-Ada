import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(process.env.DB_URI as string);

export default async function (): Promise<void> {
    await sequelize.authenticate();
}

export { sequelize };
