SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

kubectl apply -f "$SCRIPT_DIR/metallb-native.yaml"
kubectl delete validatingwebhookconfiguration metallb-webhook-configuration
kubectl apply -f "$SCRIPT_DIR/metallb-config.yaml"