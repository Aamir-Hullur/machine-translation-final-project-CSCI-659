import { Github, BookText } from 'lucide-react'
import { NavBar } from "./tubelight-navbar"
import HuggingFace from './hf'
import { ForwardRefExoticComponent, RefAttributes } from 'react'
import { LucideProps } from 'lucide-react'

const HuggingFaceIcon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>> = 
  HuggingFace as any;

export function NavBarDemo() {
  const navItems = [
    { name: 'Github', url: 'https://github.com/Guri10/neural-machine-translation', icon: Github },
    { name: 'Dataset', url: 'https://tatoeba.org/en/downloads', icon: BookText },
    { name: 'Bart', url: 'https://huggingface.co/facebook/bart-base', icon: HuggingFaceIcon },
  ]

  return <NavBar items={navItems} />
}