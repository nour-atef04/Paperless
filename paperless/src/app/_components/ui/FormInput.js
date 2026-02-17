export default function FormInput({className, placeholder}){
    return <input className={`${className} focus-ring-primary focus-visible:ring-offset-8 rounded-xs placeholder:text-brand-light`} placeholder={placeholder} />
}