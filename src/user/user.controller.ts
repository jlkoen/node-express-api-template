import { Request, Response } from 'express';
import { CreateUserInput } from './user.schema';
import { createUser, findUserById } from './user.service';
import { User } from './user.model';
import sendEmail from '../utils/mailer';

export async function createUserHander(
  req: Request<{}, {}, CreateUserInput>,
  res: Response
) {
  const body = req.body;

  try {
    const user = await createUser(body);
    if (process.env.NODE_ENV === 'dev') {
      await sendEmail({
        to: user.email,
        from: 'john@johnkoen.com',
        subject: 'Please verify your account',
        text: `verification code: ${user.verificationCode} Id: ${user._id}`
      });
    }
    return res.send('User successfully created');
  } catch (e: any) {
    if (e.code === 11000) {
      return res.status(409).send('Account already exists');
    }
    return res.status(500).send(e);
  }
}

export async function verifyUserHander(req: Request, res: Response) {
  const id = req.params.id;
  const verificationCode = req.params.verificationCode;
  const user = await findUserById(id);
  if (!user) {
    return res.status(400).send('Could not verify user');
  }

  if (user.verificationCode === verificationCode) {
    user.verifed = true;

    await user.save();
    return res.send('User successfully verified');
  }

  return res.status(400).send('Could not verify user');
}
