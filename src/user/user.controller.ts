import { Request, Response } from 'express';
import { CreateUserInput } from './user.schema';
import { createUser } from './user.service';
import sendEmail from '../utils/mailer';

export async function createUserHander(
  req: Request<{}, {}, CreateUserInput>,
  res: Response
) {
  const body = req.body;

  try {
    const user = await createUser(body);
    await sendEmail({
      to: user.email,
      from: 'john@johnkoen.com',
      subject: 'Please verify your account',
      text: `verification code: ${user.verificationCode} Id: ${user._id}`
    });
    return res.send('User successfully created');
  } catch (e: any) {
    return res.status(500).send(e);
  }
}
