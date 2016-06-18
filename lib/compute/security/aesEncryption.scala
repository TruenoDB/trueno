/** In God we trust
  * Created by Servio Palacios on 2016.06.16.
  *
  * Implementing AES encryption Scheme
  *
  */

import java.security.MessageDigest
import java.util
import javax.crypto.Cipher
import javax.crypto.spec.SecretKeySpec
import org.apache.commons.codec.binary.Base64

object aesEncryption {

  /* Encrypt function */
  def encrypt(key: String, value: String): String = {

    /* Defining Type of Cipher and Padding */
    val cipher: Cipher = Cipher.getInstance("AES/ECB/PKCS5Padding")

    /* Initialization and Key */
    cipher.init(Cipher.ENCRYPT_MODE, keyToSpec(key))

    /* Encoding Base64 */
    Base64.encodeBase64String(cipher.doFinal(value.getBytes("UTF-8")))
  }


  /* Decrypt function */
  def decrypt(key: String, encryptedValue: String): String = {

    /* Defining Type of Cipher and Padding */
    val cipher: Cipher = Cipher.getInstance("AES/ECB/PKCS5PADDING")

    /* Initialization and Key */
    cipher.init(Cipher.DECRYPT_MODE, keyToSpec(key))

    /* Decoding Base64 */
    new String(cipher.doFinal(Base64.decodeBase64(encryptedValue)))
  }

  def keyToSpec(key: String): SecretKeySpec = {

    /* Salting the Key */
    var keyBytes: Array[Byte] = (SALT + key).getBytes("UTF-8")

    /* Using SHA-1 message digest */
    val sha: MessageDigest = MessageDigest.getInstance("SHA-1")

    keyBytes = sha.digest(keyBytes)
    keyBytes = util.Arrays.copyOf(keyBytes, 16)

    new SecretKeySpec(keyBytes, "AES")

  }

  private val SALT: String =
    "jMhKlOuJnM34G6NHkqo9V010GhLAqOpF0BePojHgh1HgNg8^72k"

}
