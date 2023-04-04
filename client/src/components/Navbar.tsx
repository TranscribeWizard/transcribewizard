import { ArrowLeftIcon } from '@heroicons/react/20/solid'
import Image from 'next/image'
import Link from 'next/link'




const Navbar = ({}) => {
  return (
    <header>
    <nav className="navbar px-24">
      <div className="navbar-start">
        <Link href={'../'} >
        <ArrowLeftIcon height={20} width={20}/>
        </Link>
      </div>

      <div className="navbar-center">
        <h1>TranscribeWizard</h1>
      </div>
      <div className="navbar-end">
        <div className="dropdown-end dropdown ">
          <label tabIndex={0} className="btn-ghost btn-circle avatar btn">
            <div className="w-10 rounded-full">
            <Image
          src="/svg/backicon.svg"
          alt="back icon"
          height={20}
          width={20}
        />
            </div>
          </label>
          <ul
            tabIndex={0}
            className="dropdown-content menu rounded-box menu-compact mt-3 w-52 bg-base-100 p-2 shadow"
          >
            <li>
              <a className="justify-between">
                Profile
                <span className="badge">New</span>
              </a>
            </li>
            <li>
              <a>Settings</a>
            </li>
            <li>
              <a>Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header>
  )
}

export default Navbar