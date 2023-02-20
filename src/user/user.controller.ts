import { Request, Response } from 'express';
import { CreateUserInput } from './user.schema';
import { createUser } from './user.service';

export async function createUserHander(
  req: Request<{}, {}, CreateUserInput>,
  res: Response
) {
  const body = req.body;

  try {
    const user = await createUser(body);
    return res.send('User successfully created');
  } catch (e: any) {
    return res.status(500).send(e);
  }
}
