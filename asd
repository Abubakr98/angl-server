      <table width="100%" border="0" cellspacing="0" cellpadding="0">
  <tr>
    <td>
      <div>
        <!--[if mso]>
          <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${FURL.base + FURL.remindPassword + token}" style="height:36px;v-text-anchor:middle;width:150px;" arcsize="5%" strokecolor="#EB7035" fillcolor="#EB7035">
            <w:anchorlock/>
            <center style="color:#ffffff;font-family:Helvetica, Arial,sans-serif;font-size:16px;">Скинути пароль &rarr;</center>
          </v:roundrect>
        <![endif]-->
        <a href="${FURL.base + FURL.remindPassword + token}" style="background-color:#EB7035;border:1px solid #EB7035;border-radius:3px;color:#ffffff;display:inline-block;font-family:sans-serif;font-size:16px;line-height:44px;text-align:center;text-decoration:none;width:150px;-webkit-text-size-adjust:none;mso-hide:all;">Скинути пароль &rarr;</a>
      </div>
    </td>
  </tr>
</table>


<div>
      <div>token: <a href="${FURL.base + FURL.remindPassword + token}" style="color:#494ee0">Скинути пароль<a/></div>
      <div>Отправлено с: ${config.mail.smtp.auth.user}</div>
      </div>



      <div>
      <div>token: <a href="${FURL.base + FURL.emailVerify + token}" style="color:#494ee0">Активувати обліковий запис<a/></div>
      <div>Отправлено с: ${config.mail.smtp.auth.user}</div>
      </div>