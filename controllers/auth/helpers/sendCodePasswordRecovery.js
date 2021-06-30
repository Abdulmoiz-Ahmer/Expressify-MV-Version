import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { logger } from '~/utils';
import { status } from '~/constants';
import { UserSchema } from '~/schemas/User';
import { OtpsSchema } from '~/schemas/Otps';
import { randomBytes } from 'crypto';
import { sendMail } from '~/utils';

dotenv.config();
export const sendCodePasswordRecovery = async (req, res) => {
  //Codes that we might return coming from status
  const { OK, SERVER_ERROR, UNAUTHROIZED } = status;

  //Destructuring email from headers
  const { email } = req.headers;

  try {
    //Making sure that the user exists
    const isExisting = await UserSchema.findOne({ email }, { _id: 1 });

    if (!isExisting) {
      return res.json({
        success: false,
        error: {
          code: UNAUTHROIZED,
          message: 'Email does not exist',
        },
      });
    }

    //Expiring all the previously sent otps of the same user
    await OtpsSchema.updateMany(
      { status: 'sent', user_id: new mongoose.Types.ObjectId(isExisting._id) },
      { $set: { status: 'expired' } },
    );

    //Generating the new otp
    const otp = await randomBytes(30).toString('hex');

    //Saving new otp in the OtpsSchema
    const newOtp = new OtpsSchema({
      otp,
      otp_expiration_timestamp: Date.now() + 3600000,
      user_id: isExisting._id,
    });
    await newOtp.save();

    //Creating html template to sent in email
    const HtmlTemplate = `
                          <!DOCTYPE html>
                      <html lang="en-US">
                        <head>
                          <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
                          <title>Reset Password Email Template</title>
                          <meta name="description" content="Reset Password Email Template." />
                          <style type="text/css">
                            a:hover {
                              text-decoration: underline !important;
                            }
                          </style>
                        </head>
                        <body
                          marginheight="0"
                          topmargin="0"
                          marginwidth="0"
                          style="margin: 0px; background-color: #f2f3f8"
                          leftmargin="0"
                        >
                          <!--100% body table-->
                          <table
                            cellspacing="0"
                            border="0"
                            cellpadding="0"
                            width="100%"
                            bgcolor="#f2f3f8"
                            style="
                              @import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700);
                              font-family: 'Open Sans', sans-serif;
                            "
                          >
                            <tr>
                              <td>
                                <table
                                  style="background-color: #f2f3f8; max-width: 670px; margin: 0 auto"
                                  width="100%"
                                  border="0"
                                  align="center"
                                  cellpadding="0"
                                  cellspacing="0"
                                >
                                  <tr>
                                    <td style="height: 80px">&nbsp;</td>
                                  </tr>
                                  <tr>
                                    <td style="text-align: center">
                                      <a href="https://rakeshmandal.com" title="logo" target="_blank">
                                        <img
                                          width="60"
                                          src="https://i.ibb.co/hL4XZp2/android-chrome-192x192.png"
                                          title="logo"
                                          alt="logo"
                                        />
                                      </a>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td style="height: 20px">&nbsp;</td>
                                  </tr>

                                  <tr>
                                    <td>
                                      <table
                                        width="95%"
                                        border="0"
                                        align="center"
                                        cellpadding="0"
                                        cellspacing="0"
                                        style="
                                          max-width: 670px;
                                          background: #fff;
                                          border-radius: 3px;
                                          text-align: center;
                                          -webkit-box-shadow: 0 6px 18px 0 rgba(0, 0, 0, 0.06);
                                          -moz-box-shadow: 0 6px 18px 0 rgba(0, 0, 0, 0.06);
                                          box-shadow: 0 6px 18px 0 rgba(0, 0, 0, 0.06);
                                        "
                                      >
                                        <tr>
                                          <td style="height: 40px">&nbsp;</td>
                                        </tr>
                                        <tr>
                                          <td style="padding: 0 35px">
                                            <h1
                                              style="
                                                color: #1e1e2d;
                                                font-weight: 500;
                                                margin: 0;
                                                font-size: 32px;
                                                font-family: 'Rubik', sans-serif;
                                              "
                                            >
                                              You have requested to reset your password
                                            </h1>
                                            <span
                                              style="
                                                display: inline-block;
                                                vertical-align: middle;
                                                margin: 29px 0 26px;
                                                border-bottom: 1px solid #cecece;
                                                width: 100px;
                                              "
                                            ></span>
                                            <p
                                              style="
                                                color: #455056;
                                                font-size: 15px;
                                                line-height: 24px;
                                                margin: 0;
                                              "
                                            >
                                              We cannot simply send you your old password. A unique
                                              code to reset your password has been generated for you.
                                              To reset your password, click the following link and
                                              enter the following code.
                                            </p>
                                          
                                            <a
                                              href="${process.env.FRONTEND_URL}/reset-password/${otp}"
                                              style="
                                                background: #20e277;
                                                text-decoration: none !important;
                                                font-weight: 500;
                                                margin-top: 35px;
                                                color: #fff;
                                                text-transform: uppercase;
                                                font-size: 14px;
                                                padding: 10px 24px;
                                                display: inline-block;
                                                border-radius: 50px;
                                              "
                                              >Reset Password</a
                                            >
                                          </td>
                                        </tr>
                                        <tr>
                                          <td style="height: 40px">&nbsp;</td>
                                        </tr>
                                      </table>
                                    </td>
                                  </tr>

                                  <tr>
                                    <td style="height: 20px">&nbsp;</td>
                                  </tr>
                                  <tr>
                                    <td style="height: 80px">&nbsp;</td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                          </table>
                          <!--/100% body table-->
                        </body>
                      </html>
    `;

    //Invoking the email sent method
    sendMail(
      email,
      'Password Recovery',
      'Password Recovery Code: **************',
      HtmlTemplate,
    );

    //Sending response in case everything went well!
    return res.json({
      success: true,
      data: {
        code: OK,
        otp,
        message: 'Otp sent please check your email',
      },
    });
  } catch (e) {
    //Log in case of any abnormal crash
    logger('error', 'Error:', e.message);
    return res.json({
      success: false,
      error: {
        code: SERVER_ERROR,
        message: 'Internal Server Error',
      },
    });
  }
};
