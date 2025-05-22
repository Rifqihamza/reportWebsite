export default function FooterComponent() {
    return <footer className="fixed bottom-0 left-0 right-0 text-center">
        <h1 className="text-xs">
            © {new Date().getFullYear()} IT MIVHS. All Rights Reserved.
        </h1>
    </footer>
}