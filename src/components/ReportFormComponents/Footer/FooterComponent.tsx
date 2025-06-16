export default function FooterComponent() {
    return <footer className="md:absolute md:-bottom-20 left-0 right-0 text-center">
        <h1 className="text-xs">
            © {new Date().getFullYear()} IT MIVHS. All Rights Reserved.
        </h1>
    </footer>
}