import Business from '../db/models/business';
import { NextFunction } from 'express';
import Group from '../db/models/group';
import { InvitedAction, MemberStatus, RoleTypes } from '../utils/constant';
import Jwt from './jwtService';
import UserService from './userService';
import { sendEmail } from '../utils/sendgrid';
import { BusinessMember } from '../db/models/businessMember';
import User from '../db/models/user';

const userService = new UserService();
const jwtService = new Jwt();
export default class BusinessService {
    public async getBusinessAdmin(
        businessId: number,
        next: NextFunction,
    ): Promise<string | void> {
        try {
            const business = await Business.findByPk(businessId);
            return business ? business['creator'] : business;
        } catch (err) {
            return next(err);
        }
    }

    public async changeUserStatus(
        businessId: number,
        userId: number,
        status: MemberStatus.ACTIVE | MemberStatus.INACTIVE,
        next: NextFunction,
    ): Promise<{
        members: BusinessMember[];
        id: number;
    } | void> {
        try {
            await BusinessMember.update(
                {
                    status: status,
                },
                {
                    where: {
                        businessId: businessId,
                        userId: userId,
                    },
                },
            );
            const members = await BusinessMember.findAll({
                where: {
                    businessId: businessId,
                },
            });
            const member = await BusinessMember.findOne({
                where: {
                    businessId: businessId,
                    userId: userId,
                },
            });
            return {
                members,
                id: member['id'],
            };
        } catch (err) {
            return next(err);
        }
    }
    public async getUserBusinessesById(
        userId: number,
        next: NextFunction,
    ): Promise<{
        members: BusinessMember[];
        businesses: Business[];
    } | void> {
        try {
            const members = await BusinessMember.findAll({
                where: {
                    userId: userId,
                },
            });
            const businesses: Business[] = [];
            for (const member of members) {
                businesses.push(
                    await Business.findByPk(member['businessId'], {
                        include: [
                            {
                                model: Group,
                            },
                            {
                                model: User,
                            },
                        ],
                    }),
                );
            }
            return {
                members,
                businesses,
            };
        } catch (err) {
            return next(err);
        }
    }
    public async updateNameById(
        businessId: number,
        name: string,
        next: NextFunction,
    ): Promise<Business | void> {
        try {
            await Business.update(
                {
                    name: name,
                },
                {
                    where: {
                        id: businessId,
                    },
                },
            );
            return Business.findByPk(businessId);
        } catch (err) {
            return next(err);
        }
    }
    public async getAll(
        next: NextFunction,
        userId?: number,
    ): Promise<{
        businesses: Business[];
        members: BusinessMember[];
    } | void> {
        try {
            let businesses;
            if (userId) {
                businesses = await Business.findAll({
                    where: {
                        creator: userId,
                    },
                    include: [
                        {
                            all: true,
                            nested: true,
                        },
                    ],
                });
            } else {
                businesses = await Business.findAll();
            }
            const members = [];

            for (const business of businesses) {
                members.push(
                    await BusinessMember.findAll({
                        where: {
                            businessId: business['id'],
                        },
                    }),
                );
            }
            members.forEach((item) => (item = item.dataValues));
            return {
                businesses,
                members,
            };
        } catch (err) {
            return next(err);
        }
    }

    public async inviteUser(
        email: string,
        businessId: number,
        next: NextFunction,
    ): Promise<Business | void> {
        try {
            let user = await userService.getUserByEmail(email, next);
            let verify = user
                ? await BusinessMember.findOne({
                      where: {
                          businessId: businessId,
                          userId: user['id'],
                      },
                  })
                : null;
            const status =
                verify && verify['status'] === MemberStatus.ACTIVE
                    ? InvitedAction.ACTIVE
                    : InvitedAction.SIGNUP;
            const inviteStatus = user
                ? MemberStatus.ACTIVE
                : MemberStatus.INVITED;

            if (!verify || verify?.status === MemberStatus.INVITED) {
                let inviteToken;
                if (!verify) {
                    if (!user) {
                        user = await userService.addNewUser(
                            {
                                firstName: ' ',
                                lastName: ' ',
                                email: email,
                                password: ' ',
                                role: RoleTypes.USER,
                            },
                            next,
                        );
                    }

                    inviteToken = jwtService.generateInviteToken(
                        email,
                        user['id'],
                    );
                    verify = await BusinessMember.create({
                        userId: user['id'],
                        businessId: businessId,
                        status: inviteStatus,
                        token: inviteToken,
                    });
                } else {
                    inviteToken = jwtService.generateInviteToken(
                        email,
                        verify.userId,
                    );
                    await BusinessMember.update(
                        {
                            token: inviteToken,
                        },
                        {
                            where: {
                                businessId: businessId,
                                userId: verify.userId,
                            },
                        },
                    );
                    verify.token = inviteToken;
                }
                await sendEmail(
                    email,
                    'Invitation from Ada Learning',
                    `Please, follow the link ${process.env.CLIENT_HOST}/user-businesses?item=${inviteToken}&status=${status}`,
                    next,
                );
                return Business.findByPk(businessId);
            } else if (verify?.status === 'active') {
                return null;
            }
        } catch (err) {
            return next(err);
        }
    }

    public async createBusiness(
        name: string,
        creator: number,
        next: NextFunction,
    ): Promise<Business | void> {
        try {
            return Business.create({
                name: name,
                creator: creator,
            });
        } catch (err) {
            return next(err);
        }
    }

    public async deleteUserToken(
        token: string,
        userId: number,
        next: NextFunction,
    ): Promise<[number] | void> {
        try {
            return BusinessMember.update(
                {
                    token: null,
                },
                {
                    where: { userId, token },
                },
            );
        } catch (err) {
            return next(err);
        }
    }
    public async getBusinessById(
        id: number,
        next: NextFunction,
    ): Promise<Business | void> {
        try {
            return Business.findByPk(id);
        } catch (err) {
            return next(err);
        }
    }

    public async deleteBusinessById(
        id: number,
        next: NextFunction,
    ): Promise<Business | void> {
        try {
            const deleteBusiness = await Business.findOne({
                where: {
                    id: id,
                },
                include: [
                    {
                        all: true,
                    },
                ],
            });
            if (deleteBusiness['Users']?.length) {
                await BusinessMember.destroy({
                    where: {
                        businessId: id,
                    },
                });
            }
            if (deleteBusiness['Groups']?.length) {
                await Group.destroy({
                    where: {
                        businessId: id,
                    },
                });
            }
            await Business.destroy({
                where: {
                    id,
                },
            });
            return deleteBusiness;
        } catch (err) {
            return next(err);
        }
    }
}
