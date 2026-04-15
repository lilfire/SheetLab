import { useContext } from 'react'
import { TemplateExtensionsContext } from './TemplateExtensionsContext'

export default function TemplateSlot({ name, children, ...props }) {
  const extensions = useContext(TemplateExtensionsContext)
  const Override = extensions?.[name]
  if (!Override) return children
  return <Override {...props}>{children}</Override>
}
