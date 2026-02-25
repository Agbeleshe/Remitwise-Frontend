import { NextRequest, NextResponse } from 'next/server';
import { Keypair, StrKey } from '@stellar/stellar-sdk';
import { getNonce, deleteNonce } from '@/lib/auth/nonce-store';
import { getTranslator } from '@/lib/i18n';
import {
  createSession,
  getSessionCookieHeader,
} from '../../../../lib/session';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * POST /api/auth/login
 * Verify a signature and authenticate user
 * 
 * Request Body:
 * - address: Stellar public key
 * - message: The nonce that was signed
 * - signature: Base64-encoded signature
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { address, message, signature } = body;
    const t = getTranslator(request.headers.get('accept-language'));

    if (!address || !message || !signature) {
      return NextResponse.json(
        { error: t('errors.address_signature_required') || 'Missing required fields: address, message, signature' },
        { status: 400 }
      );
    }

    // Validate Stellar address format
    if (!StrKey.isValidEd25519PublicKey(address)) {
      return NextResponse.json(
        { error: t('errors.invalid_address_format') || 'Invalid Stellar address format' },
        { status: 400 }
      );
    }

    // Verify nonce exists and hasn't expired
    const storedNonce = getNonce(address);
    if (!storedNonce || storedNonce !== message) {
      return NextResponse.json(
        { error: t('errors.nonce_expired') || 'Invalid or expired nonce' },
        { status: 401 }
      );
    }

    try {
      // Verify the signature
      const keypair = Keypair.fromPublicKey(address);
      const messageBuffer = Buffer.from(message, 'utf8');
      const signatureBuffer = Buffer.from(signature, 'base64');

      const isValid = keypair.verify(messageBuffer, signatureBuffer);

      if (!isValid) {
        return NextResponse.json(
          { error: t('errors.invalid_signature') || 'Invalid signature' },
          { status: 401 }
        );
      }

      // Delete used nonce (one-time use)
      deleteNonce(address);

      // Create session cookie like from HEAD
      const sealed = await createSession(address);
      const cookieHeader = getSessionCookieHeader(sealed);

      return new Response(
        JSON.stringify({ 
          success: true, 
          token: `mock-jwt-${address.substring(0, 10)}`, // Keeping this property for compatibility with main branch frontend changes
          address 
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Set-Cookie': cookieHeader,
          },
        }
      );

    } catch (verifyError) {
      console.error('Signature verification error:', verifyError);
      return NextResponse.json(
        { error: t('errors.signature_verification_failed') || 'Invalid signature' },
        { status: 401 }
      );
    }

  } catch (error) {
    console.error('Error during login:', error);
    const t = getTranslator(request.headers.get('accept-language'));
    return NextResponse.json(
      { error: t('errors.internal_server_error') || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
