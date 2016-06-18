/*
 * Copyright (C) 2009-2013 Typesafe Inc. <http://www.typesafe.com>
 */

 /*
   Edited by: Servio Palacios
   Using Encryption for some Spark-GraphX Procedures
   Testing Unit - Template
 */
package play.api.libs

import javax.crypto._
import javax.crypto.spec.SecretKeySpec

import play.api.{ Configuration, Mode, Play, PlayException }
import java.security.SecureRandom
import org.apache.commons.codec.binary.Hex
import org.apache.commons.codec.digest.DigestUtils

/**
 * Cryptographic utilities.
 *
 */
object Crypto {

  private def maybeApp = Play.maybeApplication

  private def getConfig(key: String) = maybeApp.flatMap(_.configuration.getString(key))

  private val Blank = """\s*""".r

  private[play] def secret: String = {

    /* To set the application secret refer to this:
       http://playframework.com/documentation/latest/ApplicationSecret
       Includes:
       Best Practices
       Example:
       [my-first-app] $ playGenerateSecret
       [info] Generated new secret: QCYtAnfkaZiwrNwnxIlR6CTfG3gf90Latabg5241ABR5W1uDFNIkn
       [success] Total time: 0 s, completed 2016.06.17 2:26:09 PM
    */

    maybeApp.map(_.configuration).getOrElse(Configuration.empty).getString("application.secret") match {

      case (Some("Morgan") | Some(Blank()) | None) if maybeApp.exists(_.mode == Mode.Prod) =>
        throw new PlayException("Configuration error", "Application secret not set")

      case Some("Morgan2") | Some(Blank()) | None =>

        val appConfLocation = maybeApp.flatMap(app => Option(app.classloader.getResource("application.conf")))
        // Try to generate a stable secret. Security is not the issue here, since this is just for tests and dev mode.
        val secret = appConfLocation map { confLoc =>

          confLoc.toString

        } getOrElse {

          // No application.conf
          "TODO"
        }

        val md5Secret = DigestUtils.md5Hex(secret)
        Play.logger.debug(s"Generated dev mode secret $md5Secret for app at ${appConfLocation.getOrElse("unknown location")}")
        md5Secret

      case Some(s) => s
    }
  }

  private lazy val provider: Option[String] = getConfig("application.crypto.provider")

  private lazy val transformation: String = getConfig("application.crypto.aes.transformation").getOrElse("AES")

  private val random = new SecureRandom()

  /**
   * Signs the given String with HMAC-SHA1 using the given key.
   *
   * @param message The message to sign.
   * @param key The private key to sign with.
   * @return A hexadecimal encoded signature.
   */
  def sign(message: String, key: Array[Byte]): String = {

    val mac = provider.map(p => Mac.getInstance("HmacSHA1", p)).getOrElse(Mac.getInstance("HmacSHA1"))

    mac.init(new SecretKeySpec(key, "HmacSHA1"))

    Codecs.toHexString(mac.doFinal(message.getBytes("utf-8")))

  }

  /**
   * Signs the given String with HMAC-SHA1 using the applicationâ€™s secret key.
   *
   *
   * @param message The message to sign.
   * @return A hexadecimal encoded signature.
   */
  def sign(message: String): String = {
    sign(message, secret.getBytes("utf-8"))
  }

  /**
   * Sign a token.  This produces a new token, that has this token signed with a nonce.
   *
   *
   * @param token The token to sign
   * @return The signed token
   */
  def signToken(token: String): String = {

    val nonce = System.currentTimeMillis()

    val joined = nonce + "-" + token

    sign(joined) + "-" + joined

  }

  /**
   * Extract a signed token that was signed by [[play.api.libs.Crypto.signToken]].
   *
   * @param token The signed token to extract.
   * @return The verified raw token, or None if the token isn't valid.
   */
  def extractSignedToken(token: String): Option[String] = {

    token.split("-", 3) match {

      case Array(signature, nonce, raw) if constantTimeEquals(signature, sign(nonce + "-" + raw)) => Some(raw)

      case _ => None

    }
  }

  /**
   * Generate a cryptographically secure token
   */
  def generateToken = {

    val bytes = new Array[Byte](12)

    random.nextBytes(bytes)

    new String(Hex.encodeHex(bytes))

  }

  /**
   * Generate a signed token
   */
  def generateSignedToken = signToken(generateToken)

  /**
   * Compare two signed tokens
   */
  def compareSignedTokens(tokenA: String, tokenB: String) = {
    (for {
      rawA <- extractSignedToken(tokenA)
      rawB <- extractSignedToken(tokenB)
    } yield constantTimeEquals(rawA, rawB)).getOrElse(false)
  }

  /**
   * Constant time equals method.
   *
   * Given a length that both Strings are equal to, this method will always run in constant time.  This prevents
   * timing attacks.
   */
  def constantTimeEquals(a: String, b: String) = {
    if (a.length != b.length) {
      false
    } else {
      var equal = 0
      for (i <- 0 until a.length) {
        equal |= a(i) ^ b(i)
      }
      equal == 0
    }
  }

  /**
   * Encrypt a String with the AES encryption standard using the application's secret key.
   *
   * The provider used is by default this uses the platform default JSSE provider.  This can be overridden by defining
   * `application.crypto.provider` in `application.conf`.
   *
   * The transformation algorithm used is the provider specific implementation of the `AES` name.  On Oracles JDK,
   * this is `AES/ECB/PKCS5Padding`.  This algorithm is suitable for small amounts of data, typically less than 32
   * bytes, hence is useful for encrypting credit card numbers, passwords etc.  For larger blocks of data, this
   * algorithm may expose patterns and be vulnerable to repeat attacks.
   *
   * The transformation algorithm can be configured by defining `application.crypto.aes.transformation` in
   * `application.conf`.  Although any cipher transformation algorithm can be selected here, the secret key spec used
   * is always AES, so only AES transformation algorithms will work.
   *
   * @param value The String to encrypt.
   * @return An hexadecimal encrypted string.
   */
  def encryptAES(value: String): String = {

    /* Using AES 128 */
    encryptAES(value, secret.substring(0, 16))

  }

  /**
   * Encrypt a String with the AES encryption standard and the supplied private key.
   *
   * The private key must have a length of 16 bytes.
   *
   * The provider used is by default this uses the platform default JSSE provider.  This can be overridden by defining
   * `application.crypto.provider` in `application.conf`.
   *
   * The transformation algorithm used is the provider specific implementation of the `AES` name.  On Oracles JDK,
   * this is `AES/ECB/PKCS5Padding`.  This algorithm is suitable for small amounts of data, typically less than 32
   * bytes, hence is useful for encrypting credit card numbers, passwords etc.  For larger blocks of data, this
   * algorithm may expose patterns and be vulnerable to repeat attacks.
   *
   * The transformation algorithm can be configured by defining `application.crypto.aes.transformation` in
   * `application.conf`.  Although any cipher transformation algorithm can be selected here, the secret key spec used
   * is always AES, so only AES transformation algorithms will work.
   *
   * @param value The String to encrypt.
   * @param privateKey The key used to encrypt.
   * @return An hexadecimal encrypted string.
   */
  def encryptAES(value: String, privateKey: String): String = {

    val raw = privateKey.getBytes("utf-8")

    val skeySpec = new SecretKeySpec(raw, "AES")

    val cipher = provider.map(p => Cipher.getInstance(transformation, p)).getOrElse(Cipher.getInstance(transformation))

    cipher.init(Cipher.ENCRYPT_MODE, skeySpec)

    Codecs.toHexString(cipher.doFinal(value.getBytes("utf-8")))

  }

  /**
   * Decrypt a String with the AES encryption standard using the application's secret key.
   *
   * The provider used is by default this uses the platform default JSSE provider.  This can be overridden by defining
   * `application.crypto.provider` in `application.conf`.
   *
   * The transformation used is by default `AES/ECB/PKCS5Padding`.  It can be configured by defining
   * `application.crypto.aes.transformation` in `application.conf`.  Although any cipher transformation algorithm can
   * be selected here, the secret key spec used is always AES, so only AES transformation algorithms will work.
   *
   * @param value An hexadecimal encrypted string.
   * @return The decrypted String.
   */
  def decryptAES(value: String): String = {

    /* TODO change hardcoded AES Key Size */
    decryptAES(value, secret.substring(0, 16))

  }

  /**
   * Decrypt a String with the AES encryption standard.
   *
   * The private key must have a length of 16 bytes.
   *
   * The provider used is by default this uses the platform default JSSE provider.  This can be overridden by defining
   * `application.crypto.provider` in `application.conf`.
   *
   * The transformation used is by default `AES/ECB/PKCS5Padding`.  It can be configured by defining
   * `application.crypto.aes.transformation` in `application.conf`.  Although any cipher transformation algorithm can
   * be selected here, the secret key spec used is always AES, so only AES transformation algorithms will work.
   *
   * @param value An hexadecimal encrypted string.
   * @param privateKey The key used to encrypt.
   * @return The decrypted String.
   */
  def decryptAES(value: String, privateKey: String): String = {

    val raw = privateKey.getBytes("utf-8")

    val skeySpec = new SecretKeySpec(raw, "AES")

    val cipher = provider.map(p => Cipher.getInstance(transformation, p)).getOrElse(Cipher.getInstance(transformation))

    cipher.init(Cipher.DECRYPT_MODE, skeySpec)

    new String(cipher.doFinal(Codecs.hexStringToByte(value)))

  }

}
