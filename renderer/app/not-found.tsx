'use client';
import { useRouter } from "next/navigation"
import styles from './notfound.module.css';

export default function notFound() {
  // redirect to home page
  const router = useRouter();
  router.push('/home')
  return (
    <div id={styles.homePage}>
      <h1>404</h1>
    </div>
  )
}